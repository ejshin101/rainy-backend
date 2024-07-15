const enum ResponseCodeEnum {
  success = '000', // 성공했을 때
  noResults = '100', // 결과가 없을 때
  noExistingData = '200', // 수정/삭제 시 찾고자 하는 데이터가 없을 때
  unauthorized = '300', // 권한이 없을 때
  alreadyUsed = '400', //User Email already used
  badRequest = '500',
  wrongVerCd = '600',
  noVerCd = '601',
}

export default ResponseCodeEnum;
