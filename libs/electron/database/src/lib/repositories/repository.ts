import { Knex } from 'knex';
import { BetterSqliteProvider } from '../better-sqlite-provider';

export class Repository<T> {
  protected connection: Knex;

  constructor(protected readonly tableName: string) {
    this.connection = BetterSqliteProvider.instance.connection;
  }

  public async save<U>(options: U): Promise<T> {
    const query = this.connection(this.tableName);
    const [id] = await query.insert(options);
    return this.findOneById(id)
  }

  public async latest(): Promise<T> {
    const query = this.connection(this.tableName);
    return query.select('*').orderBy('createdAt', 'desc').first();
  }

  public async findOne(options: {
    where?: Record<string, any>;
    whereIn?: { column: string; values: any[] };
    relations?: string[];
    order?: { [key: string]: 'ASC' | 'DESC' };
  }): Promise<T | undefined> {
    const [result] = await this.find(options);
    return result;
  }

  public async findAll(options: {
    where?: Record<string, any>;
    whereIn?: { column: string; values: any[] };
    relations?: string[];
    order?: { [key: string]: 'ASC' | 'DESC' };
  }): Promise<T[] | undefined> {
    // Return the first result (mimicking findOne)
    return this.find(options);
  }

  public async find(options: {
    where?: Record<string, any>;
    whereIn?: { column: string; values: any[] };
    relations?: string[];
    order?: { [key: string]: 'ASC' | 'DESC' };
  }) {
    const query = this.connection(this.tableName);

    // Handle joins (relations)
    if (options.relations) {
      options.relations.forEach((relation) => {
        query.join(
          relation,
          `${this.tableName}.id`,
          `${relation}.${this.tableName}Id`
        );
      });
    }

    // Handle where conditions
    if (options.where) {
      query.where(options.where);
    }

    // Handle whereIn condition
    if (options.whereIn) {
      query.whereIn(options.whereIn.column, options.whereIn.values);
    }

    // Handle order
    if (options.order) {
      Object.keys(options.order).forEach((column) => {
        query.orderBy(column, options.order[column]);
      });
    }

    // Select fields (you can customize this as needed)
    query.select(`${this.tableName}.*`);

    // Return the first result (mimicking findOne)
    return query;
  }

  public async update(id: string, metadata: Partial<T>): Promise<T> {
    const query = this.connection(this.tableName);
    await query.update(metadata).where('id', id);
    return this.findOneById(id);
  }

  public async findOneById(id: any): Promise<T> {
    const query = this.connection(this.tableName);
    return query.select('*').where({ id }).first();
  }

  public async delete(id: string): Promise<void> {
    const query = this.connection(this.tableName);
    await query.where('id', id).del();
  }

  public async deleteAll(metadataIds?: string[]): Promise<void> {
    const query = this.connection(this.tableName);
    if (!metadataIds.length) {
      await query.delete();
    } else {
      await query.whereIn('id', metadataIds).del();
    }
  }
}
