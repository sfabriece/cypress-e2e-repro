import { DateTime } from 'luxon';

export const dateInputToJSdate = (date: string): Date => {
  return DateTime.fromISO(date).toJSDate();
};

export const dateInputToISOString = (date: string): string => {
  return DateTime.fromISO(date).toJSDate().toISOString();
};

export const ISOtoDateInput = (date: Date | null | undefined): string => {
  const isoDate = DateTime.fromISO(
    date?.toString() ?? DateTime.now().toISO()!
  ).toISODate();
  return isoDate!;
};

export async function sha1(input: string) {
  const buffer = new TextEncoder().encode(input); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer); // hash the message
  const hashArray = [...new Uint8Array(hashBuffer)]; // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(''); // convert bytes to hex string
  return hashHex;
}
