import { Body, Controller, Delete, Param, Post, Get, Request, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("profile")
export class ProfileController {

  constructor(
    private profileService: ProfileService) {
  }

  @Get()
  hello(){
    return this.profileService.getHello();
  }

  @Post("/registration")
  registration(@Body() profileDto: CreateProfileDto) {
    const result = this.profileService.sendCreatUser(profileDto).then();
    return result;
  }

  @Post("/login")
  login(@Body() profileDto: CreateProfileDto) {
    return this.profileService.sendLogin(profileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req: Request, @Param("id") id: number) {
    const result = this.profileService.sendDeleteById(req, id);
    return result;
  }
}
