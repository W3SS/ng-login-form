import { NgLoginFormPage } from './app.po';

describe('ng-login-form App', () => {
  let page: NgLoginFormPage;

  beforeEach(() => {
    page = new NgLoginFormPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
