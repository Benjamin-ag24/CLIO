import { EntitySchema } from "typeorm";

export const AuditLog = new EntitySchema({
  name: "AuditLog",
  tableName: "audit_log",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    userId: {
      name: "user_id",
      type: "int",
      nullable: true,
    },
    affectedTable: {
      name: "affected_table",
      type: "varchar",
      length: 50,
    },
    operation: {
      type: "varchar",
      length: 10,
    },
    previousData: {
      name: "previous_data",
      type: "jsonb",
      nullable: true,
    },
    newData: {
      name: "new_data",
      type: "jsonb",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});