import {sanitize} from '../index';

describe('sanitize', () => {
  it('should sanitize html', () => {
    const result = sanitize(`
      <p>This is a test</p>
      <script>console.log('test')</script>
    `);

    expect(result).toEqual('<p>This is a test</p>');
  });

  it('should sanitize nested html', () => {
    const result = sanitize(`
      <div>
        <p>This is a test</p>
        <script>console.log('test1')</script>
      </div>
      <script>console.log('test2')</script>
    `);

    expect(result).toEqual('<div><p>This is a test</p></div>');
  });

  it('should sanitize with forbidTags option', () => {
    const result = sanitize(
      `
      <br/>
      <div>
        <br/>
        <br/>
        <p>This is a test</p>
        <br/>
        <script>console.log('test1')</script>
        <br/>
      </div>
      <br/>
      <br/>
    `,
      {
        forbidTags: ['br'],
      }
    );

    expect(result).toEqual('<div><p>This is a test</p></div>');
  });

  it('should sanitize with forbidAttrs option', () => {
    const result = sanitize(
      `
      <div>
        <p style="color: red">This is a test</p>
        <script>console.log('test1')</script>
      </div>
    `,
      {
        forbidAttrs: ['style'],
      }
    );

    expect(result).toEqual('<div><p>This is a test</p></div>');
  });

  it('should sanitize with both forbidTags and forbidAttrs options', () => {
    const result = sanitize(
      `
      <div>
        <p style="color: red">This is a test</p>
        <br/>
        <script>console.log('test1')</script>
      </div>
    `,
      {
        forbidTags: ['br'],
        forbidAttrs: ['style'],
      }
    );

    expect(result).toEqual('<div><p>This is a test</p></div>');
  });

  it('should sanitize unicode tag names', () => {
    const result = sanitize(`
      <div>
        <svg></svg>
        <blocKquote>foo</blocKquote>
      </div>
    `);

    expect(result).toEqual('<div><svg></svg></div>');
  });

  it('should sanitize br self closing tag', () => {
    const result = sanitize(`
      <div>
        <p>This is a test</p>
        <br/>
        <p>This is a test</p>
      </div>
    `);

    expect(result).toEqual(
      '<div><p>This is a test</p><br><p>This is a test</p></div>'
    );
  });

  it('should sanitize incomplete html', () => {
    const result = sanitize(`
      <div>
        <p>This is a test
        <br/>
        <p>This is a test</p>
      </div>
    `);

    expect(result).toEqual(
      '<div><p>This is a test<br></p><p>This is a test</p></div>'
    );
  });

  it('should remove incomplete tag that should have a closing tag', () => {
    const result = sanitize(`
      <div>
        <svg>This is a test
        <br/>
        <p>This is a test</p>
      </div>
    `);

    expect(result).toEqual(
      '<div>This is a test<br><p>This is a test</p></div>'
    );
  });
});
