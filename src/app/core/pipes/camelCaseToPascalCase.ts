import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'camelCaseToPascalCase' })
export class CamelCaseToPascalCase implements PipeTransform {
    transform(value: string | object): string {
        if (typeof value === 'string') {
            return this.toPascalCase(value);
        }
        return this.keysToPascalCase(value);
    }

    toPascalCase(s: string): string {
        return s.replace(/([A-Z])/g, (g) => {
            return `${g[0].toUpperCase()}`;
        });
        return s;
    }

    keysToPascalCase(o: any ): any{
        if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
            const n: { [key: string]: any } = {};
            Object.keys(o)
                .forEach((k: string) => {
                    n[this.toPascalCase(k)] = this.keysToPascalCase(o[k]);
                });
            return n;
        } else if (Array.isArray(o)) {
            return o.map((i) => {
                return this.keysToPascalCase(i);
            });
        }
        return o;
    }
}
