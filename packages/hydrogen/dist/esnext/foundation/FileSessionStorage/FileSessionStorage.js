import { Cookie } from '../Cookie/Cookie';
import { v4 as uid } from 'uuid';
import path from 'path';
import { promises as fsp } from 'fs';
import { parseJSON } from '../../utilities/parse';
async function wait() {
    return new Promise((resolve) => setTimeout(resolve));
}
let writingLock = false;
/**
 * Concurrent requests with the same session can write interfere
 * writing at the same file, which crashes the process. This locks
 * so that only one file can be written at a time.
 *
 * A better solution would be to have a lock only for the same session.
 */
async function startFileLock(promise) {
    if (!writingLock) {
        writingLock = true;
        await promise();
        writingLock = false;
    }
    else {
        await wait();
        await startFileLock(promise);
    }
}
/** The `FileSessionStorage` component persists session data to the file system.
 */
export const FileSessionStorage = function (
/** The name of the cookie stored in the browser. */
name, 
/** A directory to store the session files in. Each session is stored in a separate file on the file system. */
dir, 
/** An optional object to configure [how the cookie is persisted in the browser](https://shopify.dev/api/hydrogen/components/framework/cookie#cookie-options). */
cookieOptions) {
    return function (log) {
        const cookie = new Cookie(name, cookieOptions);
        let data;
        return {
            async get(request) {
                if (data)
                    return data;
                const sid = cookie.getSessionId(request) || uid();
                const file = getSessionFile(dir, sid);
                const fileContents = await getFile(file, cookie.expires, log);
                data = fileContents.data;
                return data;
            },
            async set(request, value) {
                const sid = cookie.getSessionId(request) || uid();
                const file = getSessionFile(dir, sid);
                await writeFile(file, value, cookie.expires);
                data = value;
                cookie.setSessionid(sid);
                return cookie.serialize();
            },
            async destroy(request) {
                const sid = cookie.getSessionId(request);
                if (sid) {
                    const file = getSessionFile(dir, sid);
                    await deleteFile(file);
                }
                data = undefined;
                // @todo - set expires for Date in past
                return cookie.destroy();
            },
        };
    };
};
async function getFile(file, expires, log) {
    let content = null;
    const defaultFileContent = {
        data: {},
        expires,
    };
    await startFileLock(async () => {
        try {
            const textContent = await fsp.readFile(file, { encoding: 'utf-8' });
            try {
                content = parseJSON(textContent);
            }
            catch (error) {
                log.warn(`Cannot parse existing session file: ${file}`);
                content = defaultFileContent;
            }
            if (content.expires < new Date().getTime() ||
                content === defaultFileContent) {
                await fsp.unlink(file);
                await fsp.writeFile(file, JSON.stringify(defaultFileContent), {
                    encoding: 'utf-8',
                    flag: 'wx',
                });
                content = defaultFileContent;
            }
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
            await fsp.mkdir(path.dirname(file), { recursive: true });
            await fsp.writeFile(file, JSON.stringify(defaultFileContent), {
                encoding: 'utf-8',
                flag: 'wx',
            });
        }
    });
    return content ? content : defaultFileContent;
}
async function writeFile(file, data, expires) {
    const content = {
        data,
        expires,
    };
    await startFileLock(async () => {
        try {
            await fsp.mkdir(path.dirname(file), { recursive: true });
        }
        catch (error) {
            // directory already exists
            if (error.code !== 'EEXIST')
                throw error;
        }
        try {
            await fsp.unlink(file);
        }
        catch (error) {
            if (error.code !== 'ENOENT')
                throw error;
        }
        await fsp.writeFile(file, JSON.stringify(content), {
            encoding: 'utf-8',
            flag: 'wx',
        });
    });
}
async function deleteFile(file) {
    try {
        await startFileLock(async () => {
            await fsp.unlink(file);
        });
    }
    catch (error) {
        if (error.code !== 'ENOENT')
            throw error;
    }
}
function getSessionFile(dir, sid) {
    return path.join(dir, sid.slice(0, 3), sid.slice(3));
}
