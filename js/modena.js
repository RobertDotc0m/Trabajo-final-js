const formula = document.querySelector("#convertidor");
const chart = document.querySelector("#myChart");
let myChart;

const getDatosMonedas = async (moneda) => {
  try {
    const valores = await fetch(`https://mindicador.cl/api/${moneda}`);
    const resultados = await valores.json();
    return resultados.serie;
  } catch (error) {
    alert(error + " " + "error");
  }
};

const totalenmoneda = (valor, datos) => {
  const valorMoneda = datos[0].valor;
  const total = valor / valorMoneda;
  return Math.round(total * 100) / 100;
};

const valortipodecambio = (total) => {
  document.getElementById("valor-convertido").innerText = total;
};

const valores = (datos) => {
  return datos.map((valor) => valor.valor);
};
const fechas = (datos) => {
  return datos.map((item) => new Date(item.fecha).toLocaleDateString("US-en"));
};

const borrargrafico = () => {
  if (myChart) {
    myChart.destroy();
  }
};

const calcularcambio = async (valor, moneda) => {
  const datos = await getDatosMonedas(moneda);
  mostrargrafico(datos, valor);
};

const mostrargrafico = (datos, valor) => {
  const total = totalenmoneda(valor, datos);
  valortipodecambio(total);

  const labels = fechas(datos).splice(0, 10);
  const values = valores(datos).splice(0, 10);
  const datasets = [
    {
      label: "Moneda",
      borderColor: "blue",
      data: values,
    },
  ];
  const config = {
    type: "line",
    data: { labels, datasets },
  };
  borrargrafico();
  myChart = new Chart(chart, config);
};

formula.addEventListener("submit", async (event) => {
  event.preventDefault();

  const valor = formula.elements["valor"].value;
  const moneda = formula.elements["moneda"].value;

  if (!valor) {
    alert("ingrese un valor en numero");
    return;
  }
  if (!moneda) {
    alert("seleccione una tipo de moneda");
    return;
  }
  await calcularcambio(valor, moneda);
});
