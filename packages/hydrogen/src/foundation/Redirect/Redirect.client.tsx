import {useEffect} from 'react';
import {useNavigate} from '../../client';

type RedirectProps = {
  to: string;
};

export default function Redirect({to}: RedirectProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (to.startsWith('http')) {
      window.location.href = to;
    } else {
      navigate(to);
    }
  }, []);

  return null;
}
