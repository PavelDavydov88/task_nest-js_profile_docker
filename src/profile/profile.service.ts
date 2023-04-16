import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Profile } from "./profile.model";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProfileService {

  constructor(
    @InjectModel(Profile) private profileRepository: typeof Profile,
    @Inject("TO_USER_SERVICE") readonly client: ClientProxy,
    private jwtService: JwtService
  ) {
  }

  async sendCreatUser(dto: CreateProfileDto) {
    const userId = await firstValueFrom(this.client.send("create-user", dto));
    if (userId == null) return "This login already exist";
    const resultToken = this.creatProfile({ ...dto, userId: userId });
    return resultToken;
  }

  private async creatProfile(dto: CreateProfileDto) {
    const profile = await this.profileRepository.create({ ...dto });
    const token = this.generateToken(profile.userId.toString());
    return token;
  }

  private async generateToken(userId: string) {
    const payLoad = { userId: userId.toString() };
    return { token: this.jwtService.sign(payLoad, { secret: `${process.env.PRIVATE_KEY}`, expiresIn: "10h" }) };
  }

  async sendDeleteById(req: Request, id: number) {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const userAuth = this.jwtService.verify<CreateProfileDto>(token);
    console.log(userAuth);
    if (userAuth.userId !== id) {
      return ("User hasn't authorities");
    }
    const result = await firstValueFrom(this.client.send("delete-user", id));
    if (result == null) return "This Id is not exist";
    return this.deleteById(id);
  }

  private async deleteById(id: number) {
    const res = await this.profileRepository.destroy({ where: { "userId": id } });
    return res;
  }

  async sendLogin(dto: CreateProfileDto) {
    const res = await firstValueFrom(this.client.send("validate-user", dto));
    if (res == null) return "Invalid login/password";
    const token = this.generateToken(res);
    return token;
  }

  async getHello(){
    return 'Hello from profile';
  }
}
