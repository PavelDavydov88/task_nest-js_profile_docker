import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ProfileModule } from "./profile/profile.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Profile } from "./profile/profile.model";
import { AuthModule } from "./auth/auth.module";

@Module({
  controllers: [],
  providers: [
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Profile
      ],
      autoLoadModels: true
    }),
    ProfileModule,
    AuthModule
  ]
})
export class AppModule {
}
