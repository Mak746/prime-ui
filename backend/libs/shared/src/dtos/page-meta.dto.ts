import { BasePageOptionsDto } from './page-options.dto';

export class PageMetaDtoParameters<T = void> {
  options: T & BasePageOptionsDto;
  itemCount: number;
}

export class PageMetaDto<T = void> {
  readonly page: number;

  readonly take: number;

  readonly itemCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({ options, itemCount }: PageMetaDtoParameters<T>) {
    this.page = options.page;
    this.take = options.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageDto<T> {
  success?: boolean = true;
  message?: string;
  statusCode?: number = 200;

  data: T[];

  meta: PageMetaDto<T>;

  constructor(data: T[], meta?: PageMetaDto<T>, message = 'Successful', success = true, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data ? data : [];
    this.meta = meta
      ? meta
      : {
          hasNextPage: false,
          hasPreviousPage: false,
          itemCount: 0,
          page: 1,
          pageCount: 0,
          take: 10,
        };
  }
}
export class DetailResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  constructor(data?: T, message = 'Successful', success = true, statusCode = 200) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}
