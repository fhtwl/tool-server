import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { SystemUser } from './user.entity';
import { dateFormat } from 'src/utils/date.util';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<SystemUser> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return SystemUser;
  }

  beforeInsert(event: InsertEvent<SystemUser>): void | Promise<any> {
    event.entity.createdAt = event.entity.createdAt
      ? event.entity.createdAt
      : dateFormat(new Date());
    event.entity.updatedAt = dateFormat(new Date());
  }
}
