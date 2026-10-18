import { HttpClient } from '@angular/common/http';
import { retry } from "rxjs/operators";
import { firstValueFrom } from 'rxjs';

export class CRUDService<T> {

    protected defaulSort: string;
    protected endpoint: string;

    constructor(protected http: HttpClient) {
    }

    find(filter: any, fields: string[], skip: number, take: number, orderBy: any, includes: string[] = []): Promise<T[]> {
        let params = {
            filter: JSON.stringify(filter || {}),
            fields: fields.join(' '),
            includes: includes.join(' '),
            skip: '' + skip,
            take: '' + take,
            orderBy: orderBy? orderBy : this.defaulSort
        }
        // console.log('filter params', params);

        return firstValueFrom(this.http.get<T[]>(this.endpoint, { params }).pipe(retry(2)))
    }

    findAll(filter: any, fields: string[], skip: number, take: number, orderBy: any, includes: string[] = []): Promise<T[]> {
        let params = {
            filter: JSON.stringify(filter || {}),
            fields: fields.join(' '),
            includes: includes.join(' '),
            skip: '' + skip,
            take: '' + take,
            orderBy: orderBy? orderBy : this.defaulSort
        }
        // console.log('filter params', params);
        return firstValueFrom(this.http.get<T[]>(`${this.endpoint}/findAll`, { params }).pipe(retry(2)))
    }

    findByUser(user:string, filter: any,fields: string[], skip: number,take: number,orderBy: any, includes: string[] = []): Promise<T[]>{
        let params = {
            filter: JSON.stringify(filter || {}),
            fields: fields.join(' '),
            includes: includes.join(' '),
            skip: '' + skip,
            take: '' + take,
            orderBy: orderBy? orderBy : this.defaulSort
        }
        return firstValueFrom(this.http.get<T[]>(`${this.endpoint}/creator/${user}`, { params }).pipe(retry(2)))
    }

    findOne(filter: any, fields: string[], orderBy: any, includes: string[] = []): Promise<T> {
        let params = {
            filter: JSON.stringify(filter || {}),
            fields: fields.join(' '),
            includes: includes.join(' '),
            skip: '0',
            take: '1',
            orderBy: orderBy ? JSON.stringify(orderBy) : this.defaulSort
        }
        return firstValueFrom(this.http.get<T[]>(this.endpoint, { params }).pipe(retry(2))).then(res => res[0])
    }

    findById(id: any, fields: string[], includes: string[] = []): Promise<T> {
        let params = {
            filter: JSON.stringify({}),
            fields: fields.join(' '),
            includes: includes.join(' ')
        }
        return firstValueFrom(this.http.get<T>(`${this.endpoint}/${id}`, { params }).pipe(retry(2)))
    }

    add(entity: T): Promise<T> {
        return firstValueFrom(this.http.post<T>(this.endpoint, entity));
    }

    update(entity: T, fields: string[], updateFields: string[]): Promise<T> {
        let params = {
            fields: fields.length ? fields.join(' ') : null,
            updateFields: updateFields.length ? updateFields.join(' ') : null,
        }
        // console.log({entity});
        
        return firstValueFrom(this.http.put<T>(this.endpoint, entity, { params }));
    }

    delete(id: string): Promise<T> {
        return firstValueFrom(this.http.delete<T>(`${this.endpoint}/${id}`));
    }
}
