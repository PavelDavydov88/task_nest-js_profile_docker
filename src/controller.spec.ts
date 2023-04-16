import { Request } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ProfileController } from "./profile/profile.controller";
import { ProfileService } from "./profile/profile.service";
import { ProfileModule } from "./profile/profile.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Profile } from "./profile/profile.model";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth/auth.module";

describe('ProfileController', () => {
  let profileController: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
      imports:[
        ProfileModule,
        ClientsModule.register([{
          name: "TO_USER_SERVICE",
          transport: Transport.RMQ,
          options: {
            urls: ["amqp://rmuser:rmpassword@localhost:5672"],
            queue: "user_queue",
            queueOptions: {
              durable: false
            }
          }
        }]),
        SequelizeModule.forFeature([Profile]),
        AuthModule,
        ConfigModule.forRoot({
          // envFilePath: `.${process.env.NODE_ENV}.env`
          envFilePath: `.development.env`
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
      ],
    }).compile();

    profileService = moduleRef.get<ProfileService>(ProfileService);
    profileController = moduleRef.get<ProfileController>(ProfileController);

  });

  describe('greeting', () => {
    it('should return greeting', async () => {
      expect(await profileController.hello()).toBe('Hello from profile');
    });
  });

  describe('check error for delete', () => {
    it('should return "User hasn\'t authorities" if Id does not exist', async () => {
      const token = profileService.generateToken('0');

      let req = {headers: {authorization: 'Bearer' + ' '+ `${token}`}} as unknown as Request;
      expect(await profileController.remove( req, -1)).toEqual("User hasn't authorities")
    });
  });

});