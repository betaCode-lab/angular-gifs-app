import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({providedIn: 'root'})
export class GifsService {

  private _tagHistory: string[] = [];
  private apiKey: string = 'PUT YOUR API KEY HERE';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs/';
  public gifList!: Gif[];

  constructor(private http: HttpClient) {
    this.loadData();
  }

  get tagsHistory(): string[] {
    return [...this._tagHistory];
  }

  private storeData():void {
    localStorage.setItem('data', JSON.stringify(this.tagsHistory));
  }

  private loadData():void {
    if(!localStorage.getItem('data')) return;
    this._tagHistory = JSON.parse(localStorage.getItem('data')!);

    if(this._tagHistory.length === 0) return;

    this.searchTag(this._tagHistory[0]);
  }

  private organizeHistory(tag:string) {
    tag = tag.toLowerCase();


    if(this._tagHistory.includes(tag)) {
      this._tagHistory = this._tagHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagHistory.unshift(tag);
    this._tagHistory = this._tagHistory.splice(0, 10);

    this.storeData();
  }

  searchTag(tag:string):void {
    if(tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10');

    this.http.get<SearchResponse>(`${this.serviceUrl}search`, { params })
      .subscribe(res => {
        this.gifList = res.data;
      })
  }

}
