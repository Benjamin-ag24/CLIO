import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },

    firstName: {
      type: "varchar",
      name: "first_name",
      length: 100,
      nullable: false,
    },

    lastName: {
      type: "varchar",
      name: "last_name",
      length: 100,
      nullable: false,
    },

    email: {
      type: "varchar",
      length: 150,
      unique: true,
      nullable: false,
    },

    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },

    role: {
      type: "varchar",
      length: 50,
      default: "user",
      nullable: false,
    },

    isActive: {
      type: "boolean",
      name: "is_active",
      default: true,
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
});

export default User;