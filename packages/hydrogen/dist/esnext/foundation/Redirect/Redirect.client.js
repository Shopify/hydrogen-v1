import { useEffect } from 'react';
import { useNavigate } from '../../foundation/useNavigate/useNavigate';
export default function Redirect({ to }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (to.startsWith('http')) {
            window.location.href = to;
        }
        else {
            navigate(to);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}
