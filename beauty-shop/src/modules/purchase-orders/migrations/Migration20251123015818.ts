import { Migration } from '@mikro-orm/migrations';

export class Migration20251123015818 extends Migration {

  override async up(): Promise<void> {
    // Create supplier table
    this.addSql(`create table if not exists "supplier" ("id" text not null, "company_name" text not null, "contact_name" text null, "email" text null, "phone" text null, "address_line_1" text not null, "address_line_2" text null, "postal_code" text not null, "city" text not null, "region" text null, "country_code" text not null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "supplier_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_supplier_deleted_at" ON "supplier" (deleted_at) WHERE deleted_at IS NULL;`);

    // Create purchase_order table
    this.addSql(`create table if not exists "purchase_order" ("id" text not null, "order_number" text not null, "supplier_id" text not null, "location_id" text not null, "status" text not null default 'draft', "payment_terms" text null, "supplier_currency" text not null default 'DKK', "expected_arrival_date" timestamptz null, "shipping_company" text null, "tracking_number" text null, "reference_number" text null, "notes_to_supplier" text null, "tags" jsonb null, "subtotal" integer not null default 0, "tax_total" integer not null default 0, "shipping_total" integer not null default 0, "total_amount" integer not null default 0, "created_by" text not null, "ordered_by" text null, "ordered_at" timestamptz null, "closed_by" text null, "closed_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "purchase_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_deleted_at" ON "purchase_order" (deleted_at) WHERE deleted_at IS NULL;`);
    // Unique constraint on order_number (critical for preventing race conditions)
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "purchase_order_order_number_unique" ON "purchase_order" ("order_number");`);
    // Indexes on frequently queried fields
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_status" ON "purchase_order" ("status");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_supplier_id" ON "purchase_order" ("supplier_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_location_id" ON "purchase_order" ("location_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_created_at" ON "purchase_order" ("created_at");`);

    // Create purchase_order_line table
    this.addSql(`create table if not exists "purchase_order_line" ("id" text not null, "purchase_order_id" text not null, "product_id" text not null, "variant_id" text not null, "supplier_sku" text null, "quantity" integer not null, "received_quantity" integer not null default 0, "rejected_quantity" integer not null default 0, "unit_price" integer not null, "tax_rate" integer not null default 0, "line_total" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "purchase_order_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_line_deleted_at" ON "purchase_order_line" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_line_purchase_order_id" ON "purchase_order_line" ("purchase_order_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_line_product_id" ON "purchase_order_line" ("product_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_line_variant_id" ON "purchase_order_line" ("variant_id");`);

    // Create purchase_order_timeline table
    this.addSql(`create table if not exists "purchase_order_timeline" ("id" text not null, "purchase_order_id" text not null, "user_id" text null, "action" text not null, "message" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "purchase_order_timeline_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_timeline_deleted_at" ON "purchase_order_timeline" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_timeline_purchase_order_id" ON "purchase_order_timeline" ("purchase_order_id");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_purchase_order_timeline_created_at" ON "purchase_order_timeline" ("created_at");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "purchase_order" cascade;`);

    this.addSql(`drop table if exists "purchase_order_line" cascade;`);

    this.addSql(`drop table if exists "purchase_order_timeline" cascade;`);

    this.addSql(`drop table if exists "supplier" cascade;`);
  }

}
