import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ProfileCraetionAttrs {
  firstName: string;
  secondName: string;
  telephone: string;
  userId: number;
}

@Table({ tableName: "profile", createdAt: false, updatedAt: false })
export class Profile extends Model<Profile, ProfileCraetionAttrs> {

  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING })
  firstName: string;

  @Column({ type: DataType.STRING })
  secondName: string;

  @Column({ type: DataType.STRING })
  telephone: string;

  @Column({ type: DataType.STRING })
  userId: number;

}