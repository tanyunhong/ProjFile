import { Demo02Page } from './app.po';

describe('demo02 App', () => {
  let page: Demo02Page;

  beforeEach(() => {
    page = new Demo02Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
