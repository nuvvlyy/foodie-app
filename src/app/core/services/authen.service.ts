import { MemberService } from './member.service';
import { LineService } from './line.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(
    private lineService: LineService,
    private memberService: MemberService) { }

  authen = async (url: string): Promise<void> => {

    await this.lineService.initLine(environment.lineLiff);
  }
}
