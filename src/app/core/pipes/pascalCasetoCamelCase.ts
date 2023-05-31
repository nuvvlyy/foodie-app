import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'pascalCasetoCamelCase' })
export class PascalCasetoCamelCase implements PipeTransform {
    transform(value: string | object): string | any{
        if (typeof value === 'string') {
            return this.toCamelCase(value);
        }
        return this.keysToCamelCase(value);
    }

    toCamelCase(s: string): string {
        return s.replace(/^([A-Z])/g, (g) => {
            return `${g[0].toLowerCase()}`;
        });
        return s;
    }

    keysToCamelCase(o: any ): any{
        if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
            const n: { [key: string]: any } = {};
            Object.keys(o)
                .forEach((k: string) => {
                    n[this.toCamelCase(k)] = this.keysToCamelCase(o[k]);
                });
            return n;
        } else if (Array.isArray(o)) {
            return o.map((i) => {
                return this.keysToCamelCase(i);
            });
        }
        return o;
    }
}