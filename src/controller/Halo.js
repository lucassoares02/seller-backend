const { format, parseISO, subHours } = require('date-fns');

const Halo = {
  async slaClient(req, res) {
    const ticket = req.body.ticket;
    const sla = req.body.sla;

    console.log("=-----------------------------------------------------------=");
    console.log(sla);


    function toSeconds(time) {
      try {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      } catch (error) {
        console.log(`Error function ToSeconds: ${error}`);
      }
    }

    function toHHMMSS(seconds) {
      try {
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return [
          String(hours).padStart(2, '0'),
          String(minutes).padStart(2, '0'),
          String(secs).padStart(2, '0')
        ].join(':');

      } catch (error) {
        console.log(`Error function ToHHMMSS: ${error}`);
      }
    }


    try {

      let actionClient = null;
      let actionAgent = null;

      for (let i = 0; i < ticket.actions.length; i++) {
        if (ticket.actions[i].new_status == 24 && ticket.actions[i].old_status == 4) {
          actionClient = new Date(ticket.actions[i].datetime);
        }
        if (ticket.actions[i].new_status == 4) {
          actionAgent = new Date(ticket.actions[i].datetime);
          break;
        }
      }

      if (actionAgent == null || actionClient == null) {
        console.log("Não foi possível calcular o SLA");
        return null;
      }

      const sub = actionClient - actionAgent;


      // Converte para horas, minutos e segundos
      const hours = Math.floor(sub / (1000 * 60 * 60));
      const minutes = Math.floor((sub % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((sub % (1000 * 60)) / 1000);

      // Formata cada unidade para duas casas
      const formattedHours = String(hours).padStart(2, '0');
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');

      const timeSla = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;



      var time1 = "00:00:00";
      var firstSeconds = "00:00:00";
      var mediaSeconds = "00:00:00";

      if (sla != null) {
        time1 = sla["value"];
        firstSeconds = sla["value"];
        mediaSeconds = toHHMMSS((toSeconds(time1) + toSeconds(timeSla)) / 2); // Média todas as vezes
      } else if (sla == null) {
        firstSeconds = toHHMMSS(toSeconds(time1) + toSeconds(timeSla)); // Somente a primeira vez
        mediaSeconds = firstSeconds;
      }


      const totalSeconds = toHHMMSS(toSeconds(time1) + toSeconds(timeSla));// Todas as vezes

      console.log(`firstSeconds: ${firstSeconds}`);
      console.log(`mediaSeconds: ${mediaSeconds}`);
      console.log(`totalSeconds: ${totalSeconds}`);
      console.log(`timeSla: ${timeSla}`);

      if (actionAgent && actionClient) {
        return res.json({
          time: timeSla,
          firstSla: firstSeconds,
          totalSla: totalSeconds,
          mediaSla: mediaSeconds,
        });
      } else {
        return null;
      }
    } catch (error) {
      console.log(`Error If SLA Null: ${error}`);
      return res.json({
        time: "00:00:00",
        totalSeconds: "00:00:00",
      });
    }

  },


  async slaClient1(req, res) {
    const ticket = req.body.ticket;
    const sla = req.body.sla;

    function toSeconds(time) {
      try {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      } catch (error) {
        console.log(`Error function ToSeconds: ${error}`);
      }
    }

    function toHHMMSS(seconds) {
      try {
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return [
          String(hours).padStart(2, '0'),
          String(minutes).padStart(2, '0'),
          String(secs).padStart(2, '0')
        ].join(':');

      } catch (error) {
        console.log(`Error function ToHHMMSS: ${error}`);
      }
    }

    let actionClient = null;
    let actionAgent = null;

    for (let i = 0; i < ticket.actions.length; i++) {
      const dateFns = parseISO(ticket.actions[i].datetime);
      const adjustedDate = subHours(dateFns, 3);
      const readableDate = format(adjustedDate, "dd/MM/yyyy, HH:mm");
      if (ticket.actions[i].new_status == 24 && ticket.actions[i].old_status == 4) {
        actionClient = new Date(ticket.actions[i].datetime);
      }
      if (ticket.actions[i].new_status == 4) {
        actionAgent = new Date(ticket.actions[i].datetime);
        break;
      }
    }

    if (actionAgent == null || actionClient == null) {
      console.log("Não foi possível calcular o SLA");
      return res.json({
        time: "00:00:00",
        totalSeconds: "00:00:00",
      });
    }

    console.log(actionAgent);
    console.log(actionClient);
    console.log("-----------------------------------------");

    const sub = actionClient - actionAgent;


    // Converte para horas, minutos e segundos
    const hours = Math.floor(sub / (1000 * 60 * 60));
    const minutes = Math.floor((sub % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((sub % (1000 * 60)) / 1000);

    // Formata cada unidade para duas casas
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    const timeSla = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;



    var time1 = "00:00:00";

    if (sla != null) {
      time1 = sla["value"];
    }
    const totalSeconds = toHHMMSS(toSeconds(time1) + toSeconds(timeSla));

    console.log(time1);
    console.log(totalSeconds);

    if (actionAgent && actionClient) {
      return res.json({
        time: timeSla,
        totalSeconds: totalSeconds,
      });
    } else {
      return null;
    }

  },





};

module.exports = Halo;
