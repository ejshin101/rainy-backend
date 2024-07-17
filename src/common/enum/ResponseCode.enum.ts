const enum ResponseCodeEnum {
  success = '000', // 성공했을 때
  noResults = '100', // 결과가 없을 때
  noExistingData = '200', // 수정/삭제 시 찾고자 하는 데이터가 없을 때
  unauthorized = '300', // 권한이 없을 때
  alreadyUsed = '400', // User Email already used
  badRequest = '500', // 잘못된 요청
  wrongVerCd = '600', //인증코드가 맞지 않는 경우
  noVerCd = '601', // 인증코드가 없는 경우
}

export default ResponseCodeEnum;
