import { DynamicEntity } from '../lib/dynamic-forms/decorators/dynamic-entity.decorator';

@DynamicEntity()
export class User {
  public id: string;
  public email: string;
  public password: string;
  public name: string;
  public surname: string;
  public addresses?: {
    street?: string;
    street_number?: string;
    city?: string;
    prov?: string;
    state?: string;
    note?: string;
    [key: string]: any;
  }[] = [];
  public phone: string;
  public nickname: string;
  public roles: string[] = ['creator'];
  public bio: string = '';
  public image_url: string = '';
  public verified: boolean = false;
}
