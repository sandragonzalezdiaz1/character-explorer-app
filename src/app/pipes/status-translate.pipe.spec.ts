/* tslint:disable:no-unused-variable */
import { StatusTranslatePipe } from '../pipes/status-translate.pipe';

describe('Pipe: StatusTranslate', () => {
  it('create an instance', () => {
    let pipe = new StatusTranslatePipe('es');
    expect(pipe).toBeTruthy();
  });
});
