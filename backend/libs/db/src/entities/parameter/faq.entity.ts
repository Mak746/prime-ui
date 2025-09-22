import { BaseEntity } from '@app/shared';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FaqCategoryEntity } from './faq-category.entity';

@Entity({ name: 'faqs' })
export class FaqEntity extends BaseEntity {
  @Column()
  question: string;

  @Column()
  answer: string;

  @ManyToOne(() => FaqCategoryEntity, (o: FaqCategoryEntity) => o.faqs, { nullable: false })
  @JoinColumn({ name: 'faq_category_id', referencedColumnName: 'id' })
  faqCategory: FaqCategoryEntity;

  @Column({ name: 'faq_category_id', nullable: false, unsigned: true })
  faqCategoryId: number;

  toDto() {
    return plainToClass(FaqEntity, this);
  }
  toJSON() {
    return instanceToPlain(this);
  }
  constructor(partial: Partial<FaqEntity>) {
    super();
    Object.assign(this, partial);
  }
}
