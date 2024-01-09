'use strict';
import * as http from 'http';
import { LoginTicket, Wsfev1, PersonaServiceA13 } from "afip-apis";
import CacheService from './cache.service';


const server = http.createServer((req, res) => {
  res.end('hello!');
});

server.listen(3000, () => {
  console.log(`server listening on port ${3000}`);
  const DEFAULT_CERTIFICATE: string = "../certificate.crt";
  const DEFAULT_CERTIFICATE_KEY: string = "../certificate.key";


  const DEFAULT_URLWSAAWSDL: string = "https://wsaa.afip.gov.ar/ws/services/LoginCms?WSDL";

const loginTicket = new LoginTicket();
const cuitRepresentada = 20302760935;
const documento = 20138724191;

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance


    const token = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8c3NvIHZlcnNpb249IjIuMCI+CiAgICA8aWQgc3JjPSJDTj13c2FhaG9tbywgTz1BRklQLCBDPUFSLCBTRVJJQUxOVU1CRVI9Q1VJVCAzMzY5MzQ1MDIzOSIgdW5pcXVlX2lkPSIxMTMwMzUzMjQ5IiBnZW5fdGltZT0iMTU4NDgxNTEzNCIgZXhwX3RpbWU9IjE1ODQ4NTgzOTQiLz4KICAgIDxvcGVyYXRpb24gdHlwZT0ibG9naW4iIHZhbHVlPSJncmFudGVkIj4KICAgICAgICA8bG9naW4gZW50aXR5PSIzMzY5MzQ1MDIzOSIgc2VydmljZT0id3Nfc3JfcGFkcm9uX2ExMyIgdWlkPSJTRVJJQUxOVU1CRVI9Q1VJVCAyMDMwMjc2MDkzNSwgQ049YWxhbjMiIGF1dGhtZXRob2Q9ImNtcyIgcmVnbWV0aG9kPSIyMiI+CiAgICAgICAgICAgIDxyZWxhdGlvbnM+CiAgICAgICAgICAgICAgICA8cmVsYXRpb24ga2V5PSIyMDMwMjc2MDkzNSIgcmVsdHlwZT0iNCIvPgogICAgICAgICAgICA8L3JlbGF0aW9ucz4KICAgICAgICA8L2xvZ2luPgogICAgPC9vcGVyYXRpb24+Cjwvc3NvPgo=";
    const sign = "D30QDG0blOmjATYsRfEiDryrW0e992+CJgxW7woCrEvG180tFXUsefoTYj2ipv4dBAr0qXoVi48kLNvcZ/7aSC91TP5aZpn+15vBkhEHa7WqNiN/n9mtGmSv6KNVs8+aJYwx04gDVjAa+37g7WRNTASIFX9nHN1B+x8pEH8RTWk=";
    const a13 = new PersonaServiceA13(PersonaServiceA13.testWSDL);
    return a13.dummy({})
      .then(r => {
        return a13
          .getPersona({
            token: token,
            sign: sign,
            cuitRepresentada: cuitRepresentada as any,
            idPersona: documento as any,
          })
          .catch((err) => console.error(err));
      })
      .then((id: any) => {
        console.log(`===getIdPersonaListByDocumento===\n${JSON.stringify(id)}`);        
      });
  });