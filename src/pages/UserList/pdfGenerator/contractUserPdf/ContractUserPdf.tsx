import { Document, Image, Page, Text, View } from '@react-pdf/renderer';
import page1Image from '/img/Plantilla Docs_page-0001.jpg';
import { styles } from './contractUserStyle';
import { User } from '../../../../types';
import { ContractUser, DEGREE_DATA } from '../..';
import {
  NumerosALetras,
  formatAmountMoney,
  formatDateLongSpanish,
} from '../../../../utils';
interface ContractUserPdfProps {
  data: User & ContractUser;
}
const ContractUserPdf = ({ data }: ContractUserPdfProps) => {
  const { profile } = data;
  console.log('asdasd', String(data.date) == 'Invalid Date');
  let dailyDate = null;
  if (!data.date || String(data.date) == 'Invalid Date') {
    dailyDate = new Date();
  } else {
    dailyDate = data.date;
    dailyDate.setDate(dailyDate.getDate() + 1);
  }
  const formatDate = formatDateLongSpanish(dailyDate);
  const documentTitle = `CONTRATO SERVICIOS PROFESIONALES N° ${String(
    data.profile.id
  ).padStart(3, '0')} - 2024/G.G-DHYRIUM S.A.A`;
  const degreeSelect = DEGREE_DATA.find(el => el.value === profile.degree);
  const contractualAmount = degreeSelect?.cost[data.professionalLevel] ?? 0;
  const professionalService = `${degreeSelect?.title} de nivel ${
    data.professionalLevel
  }${profile.degree !== 'Practicante' ? ' - ' + profile.degree : ''}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBackgroundContainer} fixed={true}>
          <Image src={page1Image} style={styles.imageBackground} />
        </View>
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>{documentTitle}</Text>
          </View>
          <Text style={styles.text}>
            El presente documento, consiste en la contratación del servicio
            profesional como
            <Text style={styles.textRedBold}>
              {' '}
              {professionalService.toUpperCase()}{' '}
            </Text>
            para la elaboración de 04 proyectos que celebran de una parte la
            <Text style={styles.textBold}> CORPORACIÓN DHYRIUM S.A.A. </Text>
            con domicilio en el Jr. Cajamarca N° 154 de la ciudad Puno del
            Distrito de Puno - Provincia de Puno - Departamento de Puno,
            representado por el gerente general Ing. Juan Gonzalo Quispe
            Condori, con DNI Nº 45574308, a quien en adelante se le denominará
            como <Text style={styles.textBold}> EL CONTRATANTE</Text> y por otra
            parte, al
            <Text style={styles.textRed}>
              {' '}
              {profile.degree} en {profile.job} {profile.firstName}{' '}
              {profile.lastName}
            </Text>
            , con <Text style={styles.textRed}> DNI Nº {profile.dni}</Text>, en
            su calidad de persona natural con{' '}
            <Text style={styles.textRed}>RUC N° {data?.ruc}</Text>, a quien en
            adelante se le denominará{' '}
            <Text style={styles.textBold}>EL CONTRATISTA</Text> con domicilio en{' '}
            <Text style={styles.textRed}>
              {data.address}, del Distrito de {profile.district} de provincia de{' '}
              {profile.province}, Departamento de {profile.department}
            </Text>
            , de acuerdo a los términos y condiciones siguientes.
          </Text>
          <Text style={styles.subtitle}>CLAUSULA PRIMERA: ANTECEDENTES</Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>EL CONTRATANTE</Text> es una persona
            jurídica de derecho privado constituida para la ADMINISTRACIÓN de
            las empresas QUISVAR C Y C S.R.L., ART C Y C S.R.L., GONSAD
            LABORATORIOS E.I.R.L., SSCHILI C Y C S.C.R.L. Y COMO PERSONA NATURAL
            ING. JUAN GONZALO QUISPE CONDORI, y ENTRE OTRAS EMPRESAS el conjunto
            empresarial tiene como administrador a la{' '}
            <Text style={styles.textBold}>CORPORACION DHYRIUM S.A.A.,</Text>{' '}
            cuyo objeto social principal es dedicarse a la Elaboración de
            Expedientes Técnicos, Estudios Básicos, Estudios de Impacto
            Ambiental, entre otras como lo indica los respectivos estatus de
            cada empresa.
          </Text>
          <Text style={styles.subtitle}>
            CLAUSULA SEGUNDA: OBJETO DE CONTRATO
          </Text>
          <Text style={styles.text}>
            Por el presente documento el objeto es contratar al{' '}
            <Text style={styles.textRedBold}>
              profesional con grado de {profile.degree}
            </Text>{' '}
            para la elaboración y aprobación conforme la{' '}
            <Text style={styles.textRedBold}>
              DIRECTIVA N° 003-2024-CORPORACION DHYRIUM S.A.A.,
            </Text>{' '}
            según los términos de referencia y las normativas vigentes para la
            elaboración de 04 proyectos.
          </Text>
          <Text style={styles.subtitle}>
            CLAUSULA TERCERA: CARÁCTER Y FORMA DE PRESTAR EL SERVICIO
          </Text>
          <Text style={styles.text}>Responsable de elaborar 04 proyectos</Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>El CONTRATISTA,</Text> Tendrá que
            someterse al cumplimiento estricto de la labor, para la cual ha sido
            contratado, bajo las directivas de sus jefes inmediatos y la
            normativa vigente conforme comprenda su especialidad y así mismo
            también deberá responder por el personal responsable a cargo
            contratado para su especialidad. Con el siguiente detalle:
          </Text>
          <View style={styles.paddingLeft}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>a{')'}</Text>
              <Text style={styles.textSmall}>
                Elaborará y levanta las observaciones de la etapa{' '}
                <Text style={styles.textBold}>
                  especialidades, en la especialidad que le corresponda,
                </Text>{' '}
                de presentación y sustento de trabajo ante su ente evaluador.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>b{')'}</Text>
              <Text style={styles.textSmall}>
                Elaborará y levanta las observaciones de la etapa{' '}
                <Text style={styles.textBold}>
                  especialidades, en la especialidad que le corresponda,
                </Text>{' '}
                y la etapa de{' '}
                <Text style={styles.textBold}>costos y presupuestos</Text> en
                las diferentes plataformas en las que se evalúa el proyecto.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>c{')'}</Text>
              <Text style={styles.textSmall}>
                Deberá levantar todas las observaciones en la plataforma
                denominado ante los evaluadores de los diferentes ministerios
                y/o el CONTRATISTA pude trabajar cualquier ítem de las
                observaciones conforme la prioridad del equipo de trabajo con la
                finalidad de obtener el{' '}
                <Text style={styles.textBold}>APTO Y/O LA APROBACIÓN</Text> de
                cada proyecto.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>d{')'}</Text>
              <Text style={styles.textSmall}>
                El <Text style={styles.textBold}> equipo de trabajo </Text>
                deberá presentar el programa de trabajo hasta obtener el{' '}
                <Text style={styles.textBold}>APTO Y/O LA APROBACIÓN</Text> y el
                CONTRATISTA deberá presentar un meta de trabajo diario al
                coordinador y/o jefe inmediato, si el programa de trabajo tiene
                retrasos cualquier integrante del equipo de trabajo tiene la
                obligación de informar al jefe inmediato y programar una reunión
                al respecto.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>e{')'}</Text>
              <Text style={styles.textSmall}>
                El <Text style={styles.textBold}>CONTRATISTA</Text> deberá
                reportar sus avances en dos etapas uno por la mañana (adjuntará
                el estado actual de archivos y programación del trabajo del día)
                y otro por la tarde (adjunta el archivo trabajado durante el día
                y su evaluación de la prorrogación del día) al programa de
                trabajo indicado, toda información que envíen, deberá ser de
                forma editable e indicando el porcentaje para la verificación
                del avance del proyecto.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>f{')'}</Text>
              <Text style={styles.textSmall}>
                El presupuesto destinado para la elaboración de los proyectos
                educativos se dará conocimiento al coordinador del proyecto con
                un <Text style={styles.textBold}>{'(MEMORÁNDUM)'}</Text> donde
                se indica el desagregado por ítems del presupuesto destinado a
                cada proyecto el cual será informado al{' '}
                <Text style={styles.textBold}>equipo de trabajo</Text>.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>g{')'}</Text>
              <Text style={styles.textSmall}>
                El <Text style={styles.textBold}>coordinador </Text> y el{' '}
                <Text style={styles.textBold}>equipo de trabajo</Text> deberá
                ser responsable hasta obtener la culminación y probación de los
                proyectos en las entidades correspondientes conforme la{' '}
                <Text style={styles.textRedBold}>
                  DIRECTIVA N° 003-2024-CORPORACION DHYRIUM S.A.A.{' '}
                </Text>
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            CLAUSULA CUARTA: FUNCIONES A PRESTAR EL SERVICIO
          </Text>
          <Text style={styles.text}>
            El CONTRATISTA deberá cumplir las siguientes funciones:
          </Text>
          <View style={styles.paddingLeft}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>1.</Text>
              <Text style={styles.textSmall}>
                Revisar y evaluar los entregables de acuerdo a los términos de
                referencia de cada contrato, estos serán verificados y/o
                modificados conforme.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>2.</Text>
              <Text style={styles.textSmall}>
                Efectuar el control de calidad de la elaboración del expediente
                técnico y deberá realizarse de acuerdo con las Disposiciones
                Legales y Normas Técnicas vigentes.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>3.</Text>
              <Text style={styles.textSmall}>
                Presentar el trabajo final en el Gobierno Regional, Ministerios,
                etc. y lo estipulado en la{' '}
                <Text style={styles.textRedBold}>
                  DIRECTIVA N° 003-2024- CORPORACION DHYRIUM S.A.A.
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </Page>
      <Page>
        <View style={styles.pageBackgroundContainer} fixed={true}>
          <Image src={page1Image} style={styles.imageBackground} />
        </View>
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>{documentTitle}</Text>
          </View>

          <View style={styles.paddingLeft}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>4.</Text>
              <Text style={styles.textSmall}>
                Los plazos serán conforme los establecidos en el TDR, bases
                estándar y el contrato previa coordinación con el Coordinador
                del proyecto.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>5.</Text>
              <Text style={styles.textSmall}>
                La culminación del contrato será una vez obtenida el{' '}
                <Text style={styles.textBold}> APTO Y/O LA APROBACIÓN </Text>{' '}
                y/o la{' '}
                <Text style={styles.textBold}>
                  {' '}
                  Notificación de Culminación de Asistencia Técnica, acta de
                  aprobación, informes evaluación
                </Text>
                , cualquier otro documento que demuestre fehacientemente la
                culminación y aprobación de la evaluación del proyecto.{' '}
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            CLAUSULA QUINTA: MONTO CONTRACTUAL
          </Text>
          <Text style={styles.text}>
            El monto total del presente contrato asciende a S/.{' '}
            {formatAmountMoney(contractualAmount)} {'('}
            {NumerosALetras(contractualAmount)}
            {')'} como {professionalService} e incluye todos los impuestos de
            Ley. Este monto comprende el costo del servicio profesional, todos
            los tributos, seguros, transporte, inspecciones, pruebas y, de ser
            el caso, los costos laborales conforme a la legislación vigente, así
            como cualquier otro concepto que pueda tener incidencia sobre la
            ejecución del servicio de consultoría de obra materia del presente
            contrato.
          </Text>
          <Text style={styles.text}>
            El monto contractual es referencial, este monto contractual será
            reajustado conforme al desagregado por ítems del presupuesto
            destinado cada proyecto. Según la DIRECTIVA N° 003-2024- GRUPO. Los
            retrasos en la{' '}
            <Text style={styles.textBold}>Programación Presentada </Text>por el
            <Text style={styles.textBold}> equipo de trabajos,</Text> no será
            remunerada por el CONTRATANTE. Estas deben cumplirse conforme los
            programado para ellos el equipo y el contratista es responsable.
          </Text>
          <Text style={styles.text}>
            El monto contractual no descuenta la estadía que consiste en la
            alimentación, el alojamiento y entre otros servicios esenciales.{' '}
          </Text>
          <Text style={styles.subtitle}>CLAUSULA SEXTA: FORMA DE PAGO</Text>
          <Text style={styles.text}>El pago se realizará en dos armadas:</Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Primera armada. -</Text> El
            contratista tiene la opción de solicitar el 30% al 60% de su
            valorización, previa presentación del informe mensual del avance del
            proyecto y levantamiento de observaciones, el cual será verificado y
            evaluado por sus jefes inmediatos mediante informe de conformidad,
            este monto adelantado mensualmente se reajustará al final del
            contrato restando del monto original del contrato.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.textBold}>Segunda armada. -</Text>
            El contratista presentará un informe solicitando la cancelación de
            su contrato siendo esta parcial o total según los proyectos
            aprobados para el cual presentará todos los archivos aprobados de
            forma impresa y forma digital, los cual será verificado y evaluado
            por sus jefes inmediatos, con un informe de conformidad que acredita
            la culminación del contrato procederá su pago.
          </Text>
          <Text style={styles.text}>
            La Gerencia de Administración verificara y solicitara los documentos
            necesarios que corresponda en cada armada para realizar los pagos
            respetivos. Dentro del ellos solicitara los cargos de los informes
            mensuales correspondiente a la primera armada y el documento del
            <Text style={styles.textBold}> APTO Y/O LA APROBACIÓN </Text>y/o la
            <Text style={styles.textBold}>
              {' '}
              Notificación de Culminación de Asistencia Técnica, acta de
              aprobación, informes evaluación
            </Text>
            , cualquier otro documento que demuestre fehacientemente la
            culminación y aprobación de la evaluación del proyectoEl pago se
            realizará en dos armadas:
          </Text>
          <Text style={styles.subtitle}>
            CLAUSULA SÉPTIMA: VIGENCIA DEL CONTRATO
          </Text>
          <Text style={styles.text}>
            El CONTRATISTA tiene un plazo de ejecución del contrato en un plazo
            de 120 días calendarios para la entrega del servicio profesional
            contratado este plazo puede ser ajustados al programa de trabajos
            para la aprobación y la obtención{' '}
            <Text style={styles.textBold}> APTO Y/O LA APROBACIÓN </Text>y/o la
            <Text style={styles.textBold}>
              {' '}
              Notificación de Culminación de Asistencia Técnica, acta de
              aprobación, informes evaluación
            </Text>
            , cualquier otro documento que demuestre fehacientemente la
            culminación y aprobación de la evaluación del proyecto.
          </Text>
          <Text style={styles.subtitle}>
            CLAUSULA OCTAVA: CONFORMIDAD DE SERVICIO
          </Text>
          <Text style={styles.text}>
            La conformidad será otorgada por el jefe superior, el gerente de
            estudios y el gerente técnico. Este documento no tiene validez en
            caso de no tener conformidad de experiencia.
          </Text>
          <Text style={styles.subtitle}>
            CLAUSULA NOVENA: RESPONSABILIDAD POR VICIOS OCULTOS
          </Text>
          <Text style={styles.text}>
            La conformidad del servicio por parte del CONTRATANTE no enerva su
            derecho a reclamar posteriormente por defectos o vicios ocultos
            durante el plazo 03 años contado a partir de la conformidad otorgada
            por EL CONTRATANTE.{' '}
          </Text>
          <Text style={styles.subtitle}>
            CLAUSULA DÉCIMA: LUGAR DE LA PRESTACION DE SERVICIOS{' '}
          </Text>
          <Text style={styles.text}>
            EL CONTRATISTA, prestara los servicios contratados, en la Sede
            Central de la Empresa en la Ciudad de Puno – Departamento de Puno.
          </Text>
          <Text style={styles.text}>
            AL CONTRATISTA, se le notificara documentos mediante, programa de la
            cooperación, correo electrónico y redes sociales {'('}WhatsApp, Etc.
            {')'}
          </Text>
        </View>
      </Page>
      <Page>
        <View style={styles.pageBackgroundContainer} fixed={true}>
          <Image src={page1Image} style={styles.imageBackground} />
        </View>
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>{documentTitle}</Text>
          </View>

          <Text style={styles.subtitle}>
            CLAUSULA UNDÉCIMA: RESOLUCIÓN DE CONTRATO
          </Text>
          <Text style={styles.text}>
            Son causales de resolución del presente contrato:
          </Text>
          <View style={styles.paddingLeft}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>1.</Text>
              <Text style={styles.textSmall}>
                Incumpla injustificadamente obligaciones contractuales, legales
                o reglamentarias a su cargo, pese a haber sido requerido para
                ello.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>2.</Text>
              <Text style={styles.textSmall}>
                Haya llegado a acumular el monto máximo de la penalidad por mora
                o el monto máximo para otras penalidades, en la ejecución de la
                prestación a su cargo.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>3.</Text>
              <Text style={styles.textSmall}>
                Paralice o reduzca injustificadamente la ejecución de la
                prestación, pese a haber sido requerido para corregir tal
                situación.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>4.</Text>
              <Text style={styles.textSmall}>
                Cualquiera de las partes puede resolver el contrato por caso
                fortuito, fuerza mayor o por hecho sobreviniente al
                perfeccionamiento del contrato que no sea imputable a las partes
                y que imposibilite de manera definitiva la continuación de la
                ejecución del contrato.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>5.</Text>
              <Text style={styles.textSmall}>
                En caso que el CONTRATISTA no conteste los llamados vía
                documentaria o teléfono celular o correos o redes sociales por
                más de 3 días calendarios, la resolución del contrato será de
                automática en el cual se ejecutará la garantía.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={styles.textSmall}>6.</Text>
              <Text style={styles.textSmall}>
                En caso que el CONTRATISTA no cumpla con las fechas previstas de
                entrega de las observaciones a los evaluadores y/o entidades por
                más de 3 veces, la resolución del contrato será de automática en
                el cual se ejecutará la garantía.
              </Text>
            </View>
          </View>
          <Text style={styles.subtitle}>CLAUSULA DUODÉCIMA: PENALIDADES</Text>
          <Text style={styles.text}>
            Si EL CONTRATISTA incurre en retraso injustificado en la ejecución
            de las prestaciones objeto del contrato, EL CONTRATISTA le aplica
            automáticamente una penalidad por mora por cada día de atraso, de
            acuerdo a la siguiente fórmula:
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 50,
            }}
          >
            <View>
              <Text style={styles.text}>Pendalidad</Text>
              <Text style={styles.text}>Diaria=</Text>
            </View>
            <View>
              <Text style={styles.text}> 0.10 x monto vigente</Text>
              <Text style={{ ...styles.text, borderTopWidth: 1 }}>
                F x plazo vigente en dias
              </Text>
              <Text style={styles.text}>dias</Text>
            </View>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={styles.text}>Donde:</Text>
            <Text style={styles.text}>
              F = 0.25 para plazos mayores a sesenta (60) días o;
            </Text>
            <Text style={styles.text}>
              F = 0.40 para plazos menores o iguales a sesenta (60) días.
            </Text>
            <Text style={styles.text}>
              El retraso se justifica a través de la solicitud de ampliación de
              plazo debidamente aprobado. Adicionalmente, se considera
              justificado el retraso y en consecuencia no se aplica penalidad,
              cuando EL CONTRATISTA acredite, de modo objetivamente sustentado,
              que el mayor tiempo transcurrido no le resulta imputable. En este
              último caso la calificación del retraso como justificado por parte
              de EL CONTRATANTE no da lugar al pago de gastos adicionales.{' '}
            </Text>
            <Text style={styles.text}>
              Estas penalidades se deducen de los pagos a cuenta o del pago
              final, según corresponda; o si fuera necesario, se cobra del monto
              resultante de la ejecución de la garantía de fiel cumplimiento.
            </Text>
            <Text style={styles.text}>
              Esta penalidad puede alcanzar un monto máximo equivalente al diez
              por ciento {'('}10%{')'} del monto del contrato,{' '}
            </Text>
            <Text style={styles.text}>
              El consumo de bebidas alcohólicas en las instalaciones de la
              empresa será sancionado con el siete por ciento 7.0% del monto del
              contrato.
            </Text>
            <Text style={styles.text}>
              Cuando se llegue a cubrir el monto máximo de la penalidad por mora
              o el monto máximo para otras penalidades, de ser el caso, EL
              CONTRATANTE puede resolver el contrato por incumplimiento.{' '}
            </Text>
            <Text style={styles.text}>
              EL CONTRATANTE tiene 45 días hábiles para la cancelación de la
              <Text style={styles.textBold}> segunda armada</Text>, en caso que
              no se hiciera efectivo está, EL CONTRATANTE le paga una penalidad
              por mora por cada día de atraso, de acuerdo a la anterior fórmula,
              después de haber transcurrido los 45 días hábiles.{' '}
            </Text>
            <Text style={styles.subtitle}>
              CLAUSULA DECIMOTERCERA: GARANTÍAS
            </Text>
            <Text style={styles.text}>
              EL CONTRATISTA dejara en garantía el pago de la{' '}
              <Text style={styles.textBold}>segunda armada.</Text>
            </Text>
            <Text style={styles.text}>
              Los pagos mensuales de la primera armada no deberán superar el 30%
              del monto contractual.
            </Text>
          </View>
        </View>
      </Page>

      <Page>
        <View style={styles.pageBackgroundContainer} fixed={true}>
          <Image src={page1Image} style={styles.imageBackground} />
        </View>
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Text style={styles.title}>{documentTitle}</Text>
          </View>

          <Text style={styles.subtitle}>
            CLAUSULA DECIMOCUARTA: DECLARACIÓN JURADA DEL CONTRATISTA
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={styles.text}>
              EL CONTRATISTA se compromete a cumplir las obligaciones derivadas
              del presente contrato y permanecer hasta la aprobación y la
              obtención APTO Y/O LA APROBACIÓN y/o la Notificación de
              Culminación de Asistencia Técnica, acta de aprobación, informes
              evaluación, cualquier otro documento que demuestre fehacientemente
              la culminación y aprobación de la evaluación del proyecto.
            </Text>
            <Text style={styles.text}>
              EL CONTRATISTA se compromete con responsabilidad a trabajar en
              equipo y coordinar los trabajos para la aprobación y la obtención
              APTO Y/O LA APROBACIÓN y/o la Notificación de Culminación de
              Asistencia Técnica, acta de aprobación, informes evaluación,
              cualquier otro documento que demuestre fehacientemente la
              culminación y aprobación de la evaluación del proyecto.
            </Text>
            <Text style={styles.text}>
              EL CONTRATISTA se compromete no deberá denigrar la integridad de
              la empresa en ningún tipo de circunstancias.
            </Text>
            <Text style={styles.text}>
              EL CONTRATISTA se compromete a cuidar los bienes y cumplir
              estrictamente los reglamentos internos de la empresa.
            </Text>
            <Text style={styles.text}>
              EL CONTRATISTA se compromete no podrá divulgar ni copiar los
              archivos generados y existente en la empresa.
            </Text>
            <Text style={styles.text}>
              Si se incumple lo mencionado anteriormente EL CONTRATANTE
              procederá a sancionar según la gravedad correspondiente.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.textBold}></Text>Primero. – Procederá a
              ejecutar la garantía y requerir la devolución de los adelantos.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.textBold}></Text>Segundo. - Proceder
              legalmente según el código civil y/o penal y demás del sistema
              jurídico que resulten aplicables.
            </Text>
          </View>
          <Text style={styles.subtitle}>
            CLAUSULA DECIMOQUINTA: RESPONSABILIDAD DE LAS PARTES{' '}
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={styles.text}>
              Cuando se resuelva el contrato por causas imputables a algunas de
              las partes, se debe resarcir los daños y perjuicios ocasionados, a
              través de la indemnización correspondiente. Ello no obsta la
              aplicación de las sanciones administrativas, penales y pecuniarias
              a que dicho incumplimiento diere lugar, en el caso que éstas
              correspondan.
            </Text>
            <Text style={styles.text}>
              Lo señalado precedentemente no exime a ninguna de las partes del
              cumplimiento de las demás obligaciones previstas en el presente
              contrato.
            </Text>
          </View>
          <Text style={styles.subtitle}>
            CLAUSULA DECIMOSEXTA: APLICACIÓN SUPLETORIA DE LA LEY{' '}
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={styles.text}>
              En lo previsto por las partes en el presente contrato, ambas se
              someten a los establecido en las directivas de la empresa y
              posterior a las normas del Código Civil y demás del sistema
              jurídico que resulten aplicables.
            </Text>
            <Text style={styles.text}>
              En señal de conformidad las partes suscriben este documento en la
              ciudad de Puno, {formatDate}.
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 130,
            }}
          >
            <Text style={styles.signText}>CONTRATANTE</Text>
            <Text style={styles.signText}>CONTRATISTA</Text>
          </View>
        </View>
      </Page>
      {/* Puedes seguir añadiendo más páginas según sea necesario */}
    </Document>
  );
};

export default ContractUserPdf;
