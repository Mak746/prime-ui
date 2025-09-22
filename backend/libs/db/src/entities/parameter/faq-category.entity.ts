import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FaqEntity } from './faq.entity';

@Entity({ name: 'faq_categories' })
export class FaqCategoryEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unique: true })
  title: string;

  // faqs
  @OneToMany(() => FaqEntity, (o: FaqEntity) => o.faqCategory, { nullable: true })
  faqs?: FaqEntity[];

  toDto() {
    return plainToClass(FaqCategoryEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<FaqCategoryEntity>) {
    Object.assign(this, partial);
  }
}
