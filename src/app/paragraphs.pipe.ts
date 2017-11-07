import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paragraphs'
})
export class ParagraphsPipe implements PipeTransform {

  transform(value: string): string {
    // return value.split(/[\n\r]/).map(paragraph => `<p>${paragraph}</p>`).join('');
    return value.split(/[\n\r]/).join('<br>');
  }

}
