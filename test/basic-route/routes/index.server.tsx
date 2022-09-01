export default function home() {
  return <div className="text">Hello world</div>;
}

export const tests = ({expect, it, browser}) => {
  it('Loads hello world', async () => {
    await browser.navigate('/');

    const text = await browser.text('.text');

    expect(text).toBe('Hello world');
  });
};
