import { HttpClient } from '@angular/common/http';

export class CRUDService<T> {

    protected endpoint: string;

    constructor(protected http: HttpClient) {
    }

    find(filter: any, fields: string[], skip: number, take: number, orderBy: any, includes: string[] = []): Promise<T[]> {
        let params = {
            filter: JSON.stringify(filter || {}),
            fields: fields.join(','),
            includes: includes.join(','),
            skip: '' + skip,
            take: '' + take,
            orderBy: orderBy ? JSON.stringify(orderBy) : null
        }
        return this.http.get<T[]>(this.endpoint, { params }).toPromise()
    }

    findOne(filter: any, fields: string[], orderBy: any, includes: string[] = []): Promise<T> {
        let params = {
            filter: JSON.stringify(filter || {}),
            fields: fields.join(','),
            includes: includes.join(','),
            skip: '0',
            take: '1',
            orderBy: orderBy ? JSON.stringify(orderBy) : null
        }
        return this.http.get<T[]>(this.endpoint, { params }).toPromise().then(res => res[0])
    }

    findById(id: any, fields: string[], includes: string[] = []): Promise<T> {
        let params = {
            filter: JSON.stringify({}),
            fields: fields.join(','),
            includes: includes.join(',')
        }
        return this.http.get<T>(`${this.endpoint}/${id}`, { params }).toPromise()
    }
}