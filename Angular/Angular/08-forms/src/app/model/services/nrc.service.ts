import { Injectable } from '@angular/core';
import * as nrcList from '../../../assets/nrc-data.json';

@Injectable({
  providedIn: 'root'
})
export class NrcService {

  private database: any[] = nrcList.data

  constructor() {
  }

  getDistinctCode() {
    return this.database.map(nrc => nrc.code)
               .filter((value, index, array) => array.indexOf(value) == index)
  }

  getSuffixByCode(code: number, lang: 'Eng' | 'Mya') {
    return this.database.filter(nrc => nrc.code == code).map(nrc => {
      if(lang == 'Eng') {
        return nrc.suffixEng
      } else {
        return nrc.suffixMya
      }
    })
  }

}
