import { UncCsPlannerPage } from './app.po';

describe('unc-cs-planner App', () => {
  let page: UncCsPlannerPage;

  beforeEach(() => {
    page = new UncCsPlannerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
