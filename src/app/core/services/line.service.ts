import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LineProfile } from '../models/line-profile';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

declare const liff: any;
export type NumberOfFollowers = {
  status: string,
  followers: number,
  targetedReaches: number,
  blocks: number
};

export type TokenResponse = {
  access_token: string,
  expires_in: string,
  token_type: string,
};

@Injectable({
  providedIn: 'root'
})
export class LineService {


  User = 'muser';
  baseLineApiURL = `${environment.lineApi}`;

  private isinit: boolean;


  constructor(private router: Router, private httpClient: HttpClient) {
    this.isinit = false;
  }

  initLine = async (liffId: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if (!this.isinit) {
        liff.init(
          { liffId },
          async () => {
            this.isinit = true;
            resolve();
          },
          () => {
            reject();
          },
        );
      } else {
        resolve();
      }
    });
  }

  getProfile = async (): Promise<LineProfile> => {
    return new Promise((resolve, reject) => {
      if (!environment.production) {
        resolve({
          // userId: 'Ud1071270db7e6901x219a567048afd7ba2',
          // userId: 'Ud040bd86807415d35a52085a4a4651b1',
          userId: 'U99517b993a4ebffab439fb6b8414c393',
          displayName: 'user test',
          pictureUrl: 'https://static.wikia.nocookie.net/alexcwebbstudios/images/9/94/Rex_in_%28Toy_Story%29.jpeg',
          statusMessage: '',
        });
      } else if (!this.get()) {
        if (liff.isInClient()) {
          liff
            .getProfile()
            .then((p: any) => {
              this.set(p);
              resolve(this.get() || {});
            })
            .catch((err: any) => {
              reject(err);
            });
        } else {
          if (liff.isLoggedIn()) {
            liff
              .getProfile()
              .then((p: any) => {
                this.set(p);
                resolve(this.get() || {});
              })
              .catch((err: any)  => {
                reject(err);
              });
          } else {
            liff.login();
          }
        }
      } else {
        resolve(this.get() || {});
      }
    });
  }

  openUrl(link: string, ext: boolean): void {
    liff.openWindow({
      url: link,
      external: ext
    });
  }

  close(): void {
    if (liff.isInClient()) {
      liff.closeWindow();
    } else {
      window.close();
    }

  }

  isInClient(): boolean{
    return liff.isInClient();
  }

  get = (): LineProfile | null => {
    const linePro = localStorage.getItem(this.User);
    if (linePro) {
      return JSON.parse(linePro);
    }
    return null;
  }

  set = (profile: LineProfile) => {
    localStorage.setItem(this.User, JSON.stringify(profile));
  }

  clear(): void {
    localStorage.removeItem(this.User);
  }

  getNumberOfFollowers(date: string, token: string): Promise<NumberOfFollowers> {
    const headers = {
        Bearer: `Bearer ${token}`,
      };
    return new Promise<NumberOfFollowers>((resolve, reject) => {
    this.httpClient.get<NumberOfFollowers>(`${this.baseLineApiURL}/bot/insight/followers?date=${date}`, {headers} ).subscribe(
      (numberOfFollowers: NumberOfFollowers) => {
        resolve(numberOfFollowers);
        }, (err: any) => reject(err));
    });
  }

  getChannelAccessToken(channelID: string, channelSecret: string): Promise<TokenResponse> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set('client_id', channelID);
    body.set('client_secret', channelSecret);

    return new Promise<TokenResponse>((resolve, reject) => {
    this.httpClient.post<TokenResponse>(`${this.baseLineApiURL}/oauth/accessToken`, body.toString() , {headers} ).subscribe(
      (tokenResponse: TokenResponse) => {
        resolve(tokenResponse);
        }, (err: any) => reject(err));
    });
  }


}


