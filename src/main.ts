'use strict';
import { PersonaServiceA13, ILoginTicketResponse } from 'afip-apis';
import * as http from 'http';
import { CacheLogin } from './cache-login';
import { IgetPersonaOutput } from 'afip-apis/dist/lib/services/wsdl/PersonaServiceA13/PersonaServiceA13Port';

const path = require( "path" );
const express = require( "express" );
const app = express();
const router = express.Router();

router.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

router.post('/cuits',function(req,res){

  const DEFAULT_CERTIFICATE: string = "./certificate-prod.crt";
  const DEFAULT_CERTIFICATE_KEY: string = "./certificate.key";
  const DEFAULT_URLWSAAWSDL: string = "https://wsaa.afip.gov.ar/ws/services/LoginCms?WSDL";

  const cacheLogin = CacheLogin.Instance; 
  const cuitRepresentada = 20302760935;

  cacheLogin.certificateKey = DEFAULT_CERTIFICATE_KEY;

  cacheLogin.certificatePath = DEFAULT_CERTIFICATE;

  cacheLogin.wsaawsdl = DEFAULT_URLWSAAWSDL;

  let csvResponse = []; 

  cacheLogin.getTicket(PersonaServiceA13.serviceId).then(async (ticket: ILoginTicketResponse) => {
    
    const a13 = new PersonaServiceA13(PersonaServiceA13.produccionWSDL);

    const cuits: string[] = req.body.listado.split(/\r?\n/); 
    for (let i=0; i < cuits.length; i++) {
      const cuit = cuits[i].trim();
      if (cuit !== '') {
        const cuitNumber = parseInt(cuit.replace(/-/g, ''), 10);
        try {
          const result: IgetPersonaOutput = await a13.getPersona({

            token: ticket.credentials.token,
            sign: ticket.credentials.sign,
            cuitRepresentada,
            idPersona: cuitNumber
          });
          
          const persona = result.personaReturn.persona;
          let provincia = persona.domicilio[0].descripcionProvincia;
          if (provincia === 'CIUDAD AUTONOMA BUENOS AIRES') {
            provincia = 'CABA';
          }
          csvResponse.push([cuit, provincia, persona.descripcionActividadPrincipal]);

        } catch (err) {
            csvResponse.push([cuit, 'No existe', 'No existe']);
        }; 
      }
    };
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=file.csv');

    csvResponse.forEach(function(item) {
      res.write(item.map(function(field) {
        return '"' + field.toString().replace(/\"/g, '""') + '"';
      }).toString() + '\r\n');
    });
    
    res.end();

    /**/

  }).catch(err => {
    console.error("Error Login", err);
  });


});

app.use(express.json());
app.use(express.urlencoded());
//add the router
app.use('/', router);
app.listen(process.env.PORT || 3000);

/*console.log('Running at Port 3000');

const server = http.createServer((req, res) => {
  res.end('hello!');
});

server.listen(3000, () => {
  console.log(`server listening on port ${3000}`);
  
  






});*/