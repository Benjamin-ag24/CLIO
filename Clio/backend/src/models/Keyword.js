import { EntitySchema } from "typeorm";

const Keyword = new EntitySchema({
  name: "Keyword",
  tableName: "keywords",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },

    keyword: {
      type: "varchar",
      length: 100,
      unique: true,
      nullable: false,
    },

    createdAt: {
      type: "timestamp",
      name: "created_at",
      createDate: true,
    },
  },
});

export default Keyword;