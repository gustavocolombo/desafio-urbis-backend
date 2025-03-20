import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../modules/users/users.module';
import { WhitelabelModule } from '../modules/whitelabels/whitelabel.module';
import { AwsModule } from './../modules/aws/aws.module';

@Module({
  imports: [ScheduleModule.forRoot(), AwsModule, UsersModule, WhitelabelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
