export function defer() {
    const deferred = { status: 'pending' };
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = (value) => {
            deferred.status = 'resolved';
            return resolve(value);
        };
        deferred.reject = (error) => {
            deferred.status = 'rejected';
            return reject(error);
        };
    });
    return deferred;
}
