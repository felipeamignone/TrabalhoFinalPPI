document.addEventListener("DOMContentLoaded", function () {
  let dataUltimoAcesso = getCookie("dataUltimoAcesso");
  let usuario = getCookie("usuarioLogado");
  if (dataUltimoAcesso && usuario) {
    $("#user-info").append(
      `<span>Olá ${usuario}, seu ultimo acesso foi em: ${dataUltimoAcesso}</span>`
    );
  }

  $("select").on("focus", function () {
    $(this).css("border-color", "#dee2e6");
    $("#error-message").css("display", "none");
  });

  function fetchTable() {
    fetch("/adocoes/listar", {
      method: "get",
      headers: { "content-type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        let linhasTabela = "";

        if (r.data.length) {
          r.data.forEach((adocao) => {
            linhasTabela += `
                    <tr>
                        <td>${adocao.interessado}</td>
                        <td>${adocao.pet}</td>
                        <td>${adocao.data}</td>
                    </tr>
                    `;
          });
        } else {
          linhasTabela +=
            '<tr><td colspan="3" class="text-center">Nenhum interesse em adoção cadastrado!</td></tr>';
        }

        $("#table-content").children().remove();
        $("#table-content").append(linhasTabela);
      });
  }

  async function initialFetch() {
    await fetch("/pets/listar", {
      method: "get",
      headers: { "content-type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        let opcoesSelect = "";

        if (r.data?.length) {
          r.data.forEach((pet) => {
            opcoesSelect += `<option value="${pet.name}">${pet.name}</option> `;
          });
        }

        $("#pet-select").append(opcoesSelect);
      });

    await fetch("/interessados/listar", {
      method: "get",
      headers: { "content-type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        let opcoesSelect = "";

        if (r.data?.length) {
          r.data.forEach((interessado) => {
            opcoesSelect += `<option value="${interessado.name}">${interessado.name}</option> `;
          });
        }

        $("#interessado-select").append(opcoesSelect);
      });

    await fetch("/adocoes/listar", {
      method: "get",
      headers: { "content-type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        let linhasTabela = "";

        if (r.data.length) {
          r.data.forEach((adocao) => {
            linhasTabela += `
                    <tr>
                        <td>${adocao.interessado}</td>
                        <td>${adocao.pet}</td>
                        <td>${adocao.data}</td>
                    </tr>
                    `;
          });
        } else {
          linhasTabela +=
            '<tr><td colspan="3" class="text-center">Nenhum interesse em adoção cadastrado!</td></tr>';
        }

        $("#table-content").children().remove();
        $("#table-content").append(linhasTabela);
      });
  }

  initialFetch();

  $("#register-button").on("click", function () {
    let interessado = $("#interessado-select").val();
    let pet = $("#pet-select").val();

    const payload = { interessado, pet };

    fetch("/adocoes/cadastrar", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.ok) {
          alert(r.message);
          fetchTable();
        } else {
          if (r.data) {
            validaCampos(r.data);
          }
          $("#error-message").css("display", "flex");
          $("#error-message").text(r.message);
        }
      });
  });
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
}

function validaCampos(camposComErro) {
  camposComErro.forEach((campo) => {
    $(campo).css("border-color", "red");
  });
}
