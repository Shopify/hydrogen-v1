import {Heading} from '../elements';
export default function PageHeader({heading, children}) {
  return (
    <header className="grid w-full gap-8 p-12 justify-items-start">
      {heading && (
        <Heading as="h1" size="heading">
          {heading}
        </Heading>
      )}
      {children}
    </header>
  );
}
