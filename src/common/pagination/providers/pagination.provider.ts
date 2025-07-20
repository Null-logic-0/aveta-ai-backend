import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { Paginated } from '../interface/paginated.interface';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    queryBuilder: SelectQueryBuilder<T>,
  ): Promise<Paginated<T>> {
    const limit =
      paginationQuery.limit && !isNaN(paginationQuery.limit)
        ? paginationQuery.limit
        : 10;

    const page =
      paginationQuery.page && !isNaN(paginationQuery.page)
        ? paginationQuery.page
        : 1;

    const offset = (page - 1) * limit;

    const [results, totalItems] = await queryBuilder
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : page;
    const previousPage = page > 1 ? page - 1 : 1;

    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseURL);

    const path = newUrl.pathname;
    const queryParams = new URLSearchParams(newUrl.search);

    const buildLink = (pageNum: number) => {
      queryParams.set('limit', limit.toString());
      queryParams.set('page', pageNum.toString());
      return `${newUrl.origin}${path}?${queryParams.toString()}`;
    };

    return {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: buildLink(1),
        last: buildLink(totalPages),
        current: buildLink(page),
        next: buildLink(nextPage),
        previous: buildLink(previousPage),
      },
    };
  }
}
