import {Entity, PrimaryColumn, Column} from 'typeorm';

export enum CardType {
  new,
  learning,
  due
}

export enum Queue {
  new,
  learning,
  due
}

@Entity()
export class Cards {

  @PrimaryColumn()
  id: number;

  @Column()
  nid: number;

  @Column()
  did: number;

  @Column()
  ord: number;

  @Column()
  type: CardType;

  @Column()
  queue: Queue;

  @Column({
    type: 'text'
  })
  data: string;

}
