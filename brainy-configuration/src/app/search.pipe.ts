import { Pipe, PipeTransform, Injectable } from "@angular/core";

@Pipe({
  name: "filter",
})
@Injectable()
export class SearchPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }
    return items.filter((item) =>
      item[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
