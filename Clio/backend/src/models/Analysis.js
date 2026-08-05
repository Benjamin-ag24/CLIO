import { EntitySchema } from "typeorm";

const Analysis = new EntitySchema({
  name: "Analysis",
  tableName: "analysis",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },

    originalText: {
      type: "text",
      name: "original_text",
      nullable: false,
    },

    analyzedText: {
      type: "text",
      name: "analyzed_text",
      nullable: true,
    },

    verdict: {
      type: "varchar",
      length: 10,
      nullable: false,
    },

    explanation: {
      type: "text",
      nullable: true,
    },

    keywords: {
      type: "jsonb",
      default: [],
    },

    isDeleted: {
      type: "boolean",
      name: "is_deleted",
      default: false,
    },

    createdAt: {
      type: "timestamp",
      name: "created_at",
      createDate: true,
    },

    updatedAt: {
      type: "timestamp",
      name: "updated_at",
      updateDate: true,
    },
  },

  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
      },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});

export default Analysis;