import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import * as process from "process";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
        }),
    ],
    exports: [
        JwtModule,
    ]
})
export class AuthModule {
}
