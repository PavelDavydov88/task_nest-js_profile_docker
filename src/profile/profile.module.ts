import { Module } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Profile } from "./profile.model";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";

@Module({
  providers: [ProfileService
  ],
  controllers: [ProfileController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ClientsModule.register([{
      name: "TO_USER_SERVICE",
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URLS],
        queue: "user_queue",
        queueOptions: {
          durable: false
        }
      }
    }]),
    SequelizeModule.forFeature([Profile]),
    AuthModule
  ],
  exports: []

})
export class ProfileModule {
}
