export const ErrorCode = {
  LoginSessionExpired: 'LOGIN_SESSION_EXPIRED',
  FileUploadFail: 'FILE_UPLOAD_FAIL',
  AvatarUploadFail: 'AVATAR_UPLOAD_FAIL',
  HeaderUploadFail: 'HEADER_UPLOAD_FAIL',
  FileTooLarge: 'FILE_TOO_LARGE',
  InvalidFileType: 'INVALID_FILE_TYPE',
  NicknameExists: 'NICKNAME_EXISTS',
  NicknameTooLong: 'NICKNAME_TOO_LONG',
  BioTooLong: 'BIO_TOO_LONG',
  InvalidUrl: 'INVALID_URL',
  SubmitFail: 'SUBMIT_FAIL',
  Unexpected: 'UNEXPECTED',
} as const;

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.LoginSessionExpired]: '로그인 정보가 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCode.FileUploadFail]: '파일을 업로드하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.AvatarUploadFail]: '프로필 이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.HeaderUploadFail]: '헤더 이미지를 업로드하지 못했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.FileTooLarge]: '업로드할 수 있는 파일 용량(2MB)을 초과했습니다.',
  [ErrorCode.InvalidFileType]: '이미지 파일만 업로드하실 수 있습니다.',
  [ErrorCode.NicknameExists]: '이미 사용 중인 닉네임입니다.',
  [ErrorCode.NicknameTooLong]: '닉네임은 최대 20자까지 입력할 수 있습니다.',
  [ErrorCode.BioTooLong]: '자기소개는 최대 300자까지 입력할 수 있습니다.',
  [ErrorCode.InvalidUrl]: '올바른 형식의 URL을 입력해주세요. http:// 또는 https:// 로 시작해야 합니다.',
  [ErrorCode.SubmitFail]: '프로필 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.Unexpected]: '예기치 못한 에러가 발생했습니다. 잠시 후 다시 시도해주세요.'
};

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];