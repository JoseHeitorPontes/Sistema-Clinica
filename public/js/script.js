"use-strict";
function listarPacientes(){
    $.ajax({
        url: "/pacientes",
        type: "GET",
        dataType: "json",
        success: function(resposta){
            if(resposta.pacientes.length > 0){
                $("#tabela").css("display","table");
                $("#pesquisar").css("display","block");
                $("#msg-tabela").css("display","none");
                for(let i = 0; i < resposta.pacientes.length; i++){
                    const idade = calcularIdade(resposta.pacientes[i].dataNascimento);
                    let foto = "";
                    if(resposta.pacientes[i].foto != null){
                        foto = resposta.pacientes[i].foto;
                    }
                    else{
                        foto = "paciente.png";
                    }
                    let atendimento = "";
                    let botao = ""
                    if(resposta.pacientes[i].sintomas != null){
                        atendimento = "Atendido!";
                        botao = "Novo Atendimento";
                    }
                    else{
                        atendimento = "Ainda não atendido!";
                        botao = "Atender";
                    }
                    $("#corpo-tabela").append(`
                        <tr id='${resposta.pacientes[i].id}'>
                            <td class='text-center align-middle'><img src='/img/pacientes/${foto}' class='imagem'></td>
                            <td class='text-center align-middle'>${resposta.pacientes[i].nome}</td>
                            <td class='text-center align-middle'>${idade}</td>
                            <td class='text-center align-middle'>${resposta.pacientes[i].cpf}</td>
                            <td class='text-center align-middle'>${resposta.pacientes[i].whatsapp}</td>
                            <td class='text-center align-middle'>${atendimento}</td>
                            <td class='text-center align-middle'>
                                <button class='btn btn-info btn-atender' value='${resposta.pacientes[i].id}'>${botao}</button>
                                <button class='btn btn-success btn-editar' value='${resposta.pacientes[i].id}'>Editar</button>
                                <button class='btn btn-danger btn-deletar' value='${resposta.pacientes[i].id}'>Deletar</button>
                            </td>
                        </tr>
                    `);
                }
            }
            else{
                $("#msg-tabela").empty();
                $("#msg-tabela").append("<div class='alert alert-secondary text-center'>Nenhum paciente cadastrado!</div>");
            }
        }
    });
}
listarPacientes();
$("#campo-pesquisar").keyup(function(){
    const valor = $("#campo-pesquisar").val().toLowerCase();
    $("#tabela tr").filter(function(){
        $(this).toggle($(this).text().toLowerCase().indexOf(valor)>-1);
    });
});
$("#btn-cadastrar").click(function(){
    $("#msg-form").empty();
    $("#modal").modal("show");
});
const mascaras = {
    cpf(valor){
        return valor
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    },
    whatsapp(valor){
        return valor
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    }
};
function aplicarMascaras(){
    document.querySelectorAll("input").forEach(($input)=>{
        const campo = $input.dataset.js;
        $input.addEventListener("input", (evento)=>{
            evento.target.value = mascaras[campo](evento.target.value);
        }, false);
    });
}
aplicarMascaras();
function validarCPF(cpf){
    let Soma = 0;
    let Resto;
    let strCPF = String(cpf).replace(/[^\d]/g, '');
    if (strCPF.length !== 11)
        return false;
    if([
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
        ].indexOf(strCPF) !== -1)
        return false;
    for (i=1; i<=9; i++)
        Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i); 
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11))
        Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)))
        return false;
    Soma = 0;
    for (i = 1; i <= 10; i++)
        Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11)) 
        Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) )
        return false;
    return true;
}
function calcularIdade(data){
    const dataNascimento = new Date(data);
    const dataAtual = new Date();
    let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
    let mes = dataAtual.getMonth() - dataNascimento.getMonth();
    if(mes < 0 || (mes == 0 && dataAtual.getDate() < dataNascimento.getDate())){
        idade--;
    }
    return idade;
}
function cadastrarPaciente(formulario){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: "/cadastro",
        type: "POST",
        data: formulario,
        dataType: "json",
        contentType: false,
        cache: false,
        processData: false,
        success: function(resposta){
            if(resposta.status == 200){
                $("#nome").val("");
                $("#data").val("");
                $("#cpf").val("");
                $("#whatsapp").val("");
                $("#foto").val("");
                const idade = calcularIdade(resposta.paciente.dataNascimento);
                let foto = "";
                if(resposta.paciente.foto != null){
                    foto = resposta.paciente.foto;
                }
                else{
                    foto = "paciente.png";
                }
                $("#msg-form").empty();
                $("#msg-form").append(`<div class='alert alert-success'>${resposta.mensagem}</div>`);
                $("#corpo-tabela").append(`
                    <tr id='${resposta.paciente.id}'>
                        <td class='text-center align-middle'><img src='/img/pacientes/${foto}' class='imagem'></td>
                        <td class='text-center align-middle'>${resposta.paciente.nome}</td>
                        <td class='text-center align-middle'>${idade}</td>
                        <td class='text-center align-middle'>${resposta.paciente.cpf}</td>
                        <td class='text-center align-middle'>${resposta.paciente.whatsapp}</td>
                        <td class='text-center align-middle'>Ainda não atendido!</td>
                        <td class='text-center align-middle'>
                            <button class='btn btn-info btn-atender' value='${resposta.paciente.id}'>Atender</button>
                            <button class='btn-editar btn btn-success' value='${resposta.paciente.id}'>Editar</button>
                            <button class='btn btn-danger btn-deletar' value='${resposta.paciente.id}'>Deletar</button>
                        </td>
                    </tr>
                `);
                $("#tabela").css("display","table");
                $("#pesquisar").css("display","block");
                $("#msg-tabela").css("display","none");
            }
        }
    });
}
function enviarFormulario(nome,data,cpf,whatsapp,foto,formData,acao,id){
    const dataAtual = new Date();
    const dataFormulario = new Date(data);
    let idadeFormulario = dataAtual.getFullYear() - dataFormulario.getFullYear();
    let mesData = dataAtual.getMonth() - dataFormulario.getMonth();
    const cpfResultado = validarCPF(cpf);
    const arquivo = foto.toLowerCase();
    let tamanhoImagem = "";
    if(mesData < 0 || (mesData == 0 && dataAtual.getDate() < dataFormulario.getDate())){
        idadeFormulario--;
    }
    if(!foto == ""){
        if(acao == "insert"){
            tamanhoImagem = parseInt(document.getElementById("foto").files[0].size);
        }
        else if(acao == "update"){
            tamanhoImagem = parseInt(document.getElementById("foto-editar").files[0].size);
        }
        else{
            tamanhoImagem = parseInt(document.getElementById("foto").files[0].size);
        }
    }
    if(nome.length < 5){
        if(acao == "insert"){
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>O nome do paciente deve conter no mínimo 5 letras!</div>");
        }
        else if(acao = "update"){
            $("#msg-form-editar").empty();
            $("#msg-form-editar").append("<div class='alert alert-danger'>O nome do paciente deve conter no mínimo 5 letras!</div>");
        }
        else{
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>O nome do paciente deve conter no mínimo 5 letras!</div>");
        }
    }
    else if(idadeFormulario <= 0){
        if(acao == "insert"){
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>O paciente deve ter no mínimo 1 ano de idade para ser cadastrado!</div>");
        }
        else if(acao == "update"){
            $("#msg-form-editar").empty();
            $("#msg-form-editar").append("<div class='alert alert-danger'>O paciente deve ter no mínimo 1 ano de idade para ser cadastrado!</div>");
        }
        else{
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>O paciente deve ter no mínimo 1 ano de idade para ser cadastrado!</div>");
        }
    }
    else if(cpfResultado == false){
        if(acao == "insert"){
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>CPF inválido!</div>");
        }
        else if(acao == "update"){
            $("#msg-form-editar").empty();
            $("#msg-form-editar").append("<div class='alert alert-danger'>CPF inválido!</div>");
        }
        else{
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>CPF inválido!</div>");
        }
    }
    else if(whatsapp.length != 15){
        if(acao == "insert"){
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>whatsapp inválido!</div>");
        }
        else if(acao == "update"){
            $("#msg-form-editar").empty();
            $("#msg-form-editar").append("<div class='alert alert-danger'>whatsapp inválido!</div>");
        }
        else{
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>whatsapp inválido!</div>");
        }
    }
    else if(foto == ""){
        if(acao == "insert"){
            cadastrarPaciente(formData);
        }
        else if(acao == "update"){
            atualizarPaciente(id, formData);
        }
        else{
            cadastrarPaciente(formData);
        }
    }
    else if(!arquivo.match(/(\.jpg|\.png|\.jpeg)$/)){
        if(acao == "insert"){
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>Só são permitidas imagens PNG, JPG e JPEG!</div>");
        }
        else if(acao == "update"){
            $("#msg-form-editar").empty();
            $("#msg-form-editar").append("<div class='alert alert-danger'>Só são permitidas imagens PNG, JPG e JPEG!</div>");
        }
        else{
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>Só são permitidas imagens PNG, JPG e JPEG!</div>");
        }
    }
    else if(tamanhoImagem > 5242880){
        if(acao == "insert"){
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>Só são permitidas imagens de até 5MB!</div>");
        }
        else if(acao == "update"){
            $("#msg-form-editar").empty();
            $("#msg-form-editar").append("<div class='alert alert-danger'>Só são permitidas imagens de até 5MB!</div>");
        }
        else{
            $("#msg-form").empty();
            $("#msg-form").append("<div class='alert alert-danger'>Só são permitidas imagens de até 5MB!</div>");
        }
    }
    else{
        if(acao == "insert"){
            cadastrarPaciente(formData);
        }
        else if(acao == "update"){
            atualizarPaciente(id, formData);
        }
        else{
            cadastrarPaciente(formData);
        }
    }
}
$("#formulario").submit(function(evento){
    evento.preventDefault();
    const nome = $("#nome").val();
    const cpf = $("#cpf").val();
    const whatsapp = $("#whatsapp").val();
    const data = $("#data").val();
    const foto = document.getElementById("foto").value;
    if(nome == "" && data != "" && cpf != "" && whatsapp != ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campo de nome é obrigatório!</div>");
    }
    else if(nome != "" && data == "" && cpf != "" && whatsapp != ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campo de data de nascimento é obrigatório!</div>");
    }
    else if(nome != "" && data != "" && cpf == "" && whatsapp != ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campo de cpf é obrigatório!</div>");
    }
    else if(nome != "" && data != "" && cpf != "" && whatsapp == ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campo de whatsapp é obrigatório!</div>");
    }
    else{
        const formData = new FormData(this);
        enviarFormulario(nome,data,cpf,whatsapp,foto,formData,"insert");
    }
});
function deletarPaciente(id){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: `/pacientes/${id}`,
        method: "DELETE",
        dataType: "json",
        success: function(resposta){
            if(resposta.status == 200){
                $("#"+id).remove();
                $("#modalDeletar").modal("hide");
                if($("#corpo-tabela tr").length == 0){
                    if($("#msg-tabela").hasClass("alert-success")){
                        $("#msg-tabela").removeClass("alert-success");
                        $("#msg-tabela").addClass("alert-secondary");
                    }
                    else{
                        $("#msg-tabela").addClass("alert-secondary");
                    }
                    $("#msg-tabela").css("display","block");
                    $("#msg-tabela").empty();
                    $("#msg-tabela").append("<div class='alert alert-secondary text-center'>Nenhum paciente cadastrado!</div>");
                    $("#tabela").css("display","none");
                    $("#pesquisar").css("display","none");
                }
            }
        }
    });
}
$(document).on("click",".btn-deletar",function(){
    const btnId = $(this).val();
    $("#id-deletar").val(btnId);
    $("#modalDeletar").modal("show");
});
$("#confirm-deletar").click(function(){
    const id = $("#id-deletar").val();
    deletarPaciente(id);
});
function atualizarPaciente(id, formulario){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: "POST",
        url: `/atualizar/${id}`,
        data: formulario,
        dataType: "json",
        contentType: false,
        cache: false,
        processData: false,
        success: function(resposta){
            if(resposta.status == 200){
                $("#nome-editar").val("");
                $("#data-editar").val("");
                $("#cpf-editar").val("");
                $("#whatsapp-editar").val("");
                $("#foto-editar").val("");
                const idade = calcularIdade(resposta.paciente.dataNascimento);
                let foto = "";
                if(resposta.paciente.foto != null){
                    foto = resposta.paciente.foto;
                }
                else{
                    foto = "paciente.png";
                }
                let atendimento = "";
                let botao = "";
                if(resposta.paciente.sintomas != null){
                    atendimento = "Atendido!";
                    botao = "Novo Atendimento";
                }
                else{
                    atendimento = "Ainda não atendido!";
                    botao = "Atender";
                }
                const linha = `
                    <tr id='${resposta.paciente.id}'>
                        <td class='text-center align-middle'><img src='/img/pacientes/${foto}' class='imagem'></td>
                        <td class='text-center align-middle'>${resposta.paciente.nome}</td>
                        <td class='text-center align-middle'>${idade}</td>
                        <td class='text-center align-middle'>${resposta.paciente.cpf}</td>
                        <td class='text-center align-middle'>${resposta.paciente.whatsapp}</td>
                        <td class='text-center align-middle'>${atendimento}</td>
                        <td class='text-center align-middle'>
                            <button class='btn btn-info btn-atender' value="${resposta.paciente.id}">${botao}</button>
                            <button class='btn btn-success btn-editar' value="${resposta.paciente.id}">Editar</button>
                            <button class='btn btn-danger btn-deletar' value='${resposta.paciente.id}'>Deletar</button>
                        </td>
                    </tr>
                `;
                $(linha).replaceAll('#'+id);
                $("#modalEditar").modal("hide");
                $("#msg-tabela").css("display","block");
                $("#msg-tabela").empty();
                $("#msg-tabela").append(`
                    <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
                        ${resposta.mensagem}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `);
            }
        },
    });
}
$(document).on("click", ".btn-editar", function(){
    const btnId = $(this).val();
    $("#msg-form-editar").empty();
    $("#modalEditar").modal("show");
    $.ajax({
        type: "GET",
        url: `/editar/${btnId}`,
        dataType: "json",
        success: function(resposta){
            if(resposta.status == 200){
                $("#id-paciente-editar").val(btnId);
                $("#nome-editar").val(resposta.paciente.nome);
                const dataFormatada = String(resposta.paciente.dataNascimento).substring(0,10);
                $("#data-editar").val(dataFormatada);
                $("#cpf-editar").val(resposta.paciente.cpf);
                $("#whatsapp-editar").val(resposta.paciente.whatsapp);
            }
        }
    });
});
$("#formularioEditar").submit(function(evento){
    evento.preventDefault();
    const id = $("#id-paciente-editar").val();
    const nome = $("#nome-editar").val();
    const cpf = $("#cpf-editar").val();
    const whatsapp = $("#whatsapp-editar").val();
    const data = $("#data-editar").val();
    const foto = document.getElementById("foto-editar").value;
    if(id != "" && nome == "" && data != "" && cpf != "" && whatsapp != ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campos de data de nascimento é obrigatório!</div>");
    }
    else if(id != "" && nome != "" && data == "" && cpf != "" && whatsapp != ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campos de data de nascimento é obrigatório!</div>");
    }
    else if(id != "" && nome != "" && data != "" && cpf == "" && whatsapp != ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campos de cpf é obrigatório!</div>");
    }
    else if(id != "" && nome != "" && data != "" && cpf != "" && whatsapp == ""){
        $("#msg-form").empty();
        $("#msg-form").append("<div class='alert alert-danger text-center'>O campos de whatsapp é obrigatório!</div>");
    }
    else{
        const formData = new FormData(this);
        atualizarPaciente(id, formData);
    }
});
function atenderPaciente(id, formData){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        url: `/diagnosticar/${id}`,
        type: "POST",
        data: formData,
        dataType: "json",
        contentType: false,
        cache: false,
        processData: false,
        success: function(resposta){
            if(resposta.paciente.sintomas.length >= 9){
                $("#msg-form-atender").empty();
                $("#msg-form-atender").append(`
                    <div class='alert bg-warning text-center'>
                        Possivel Infectado!
                    </div>
                `);
            }
            else if(resposta.paciente.sintomas.length >= 6 && resposta.paciente.sintomas.length < 9){
                $("#msg-form-atender").empty();
                $("#msg-form-atender").append(`
                    <div class='alert bg-warning text-center'>
                        Pontencial Infectado! 
                    </div>
                `);
            }
            else{
                $("#msg-form-atender").empty();
                $("#msg-form-atender").append(`
                    <div class='alert bg-warning text-center'>
                        Sintomas Insuficientes! 
                    </div>
                `);
            }
            const idade = calcularIdade(resposta.paciente.dataNascimento);
            let foto = "";
            if(resposta.paciente.foto != null){
                foto = resposta.paciente.foto;
            }
            else{
                foto = "paciente.png";
            }
            let atendimento = "";
            let botao = "";
            if(resposta.paciente.sintomas != null){
                atendimento = "Atendido!";
                botao = "Novo Atendimento";
            }
            else{
                atendimento = "Ainda não atendido!";
                botao = "Atender";
            }
            const linha = `
                <tr id='${resposta.paciente.id}'>
                    <td class='text-center align-middle'><img src='/img/pacientes/${foto}' class='imagem'></td>
                    <td class='text-center align-middle'>${resposta.paciente.nome}</td>
                    <td class='text-center align-middle'>${idade}</td>
                    <td class='text-center align-middle'>${resposta.paciente.cpf}</td>
                    <td class='text-center align-middle'>${resposta.paciente.whatsapp}</td>
                    <td class='text-center align-middle'>${atendimento}</td>
                    <td class='text-center align-middle'>
                        <button class='btn btn-info btn-atender' value="${resposta.paciente.id}">${botao}</button>
                        <button class='btn btn-success btn-editar' value="${resposta.paciente.id}">Editar</button>
                        <button class='btn btn-danger btn-deletar' value='${resposta.paciente.id}'>Deletar</button>
                    </td>
                </tr>
            `;
            $(linha).replaceAll('#'+resposta.paciente.id);
        }
    });
}
$(document).on("click",".btn-atender",function(){
    const btnId = $(this).val();
    $("input[type=checkbox]").each(function(){
        if($(this).prop('checked')){
            $(this).prop('checked',false);
        }
    });
    $("#msg-form-atender").empty();
    $("#modalAtender").modal("show");
    $.ajax({
        type: "GET",
        url: `/atender/${btnId}`,
        dataType: "json",
        success: function(resposta){
            if(resposta.status == 200){
                $("#id-paciente-atender").val(btnId);
                $("#atender-titulo").text("Paciente: "+resposta.paciente.nome);
            }
        }
    });
});
$("#formularioAtender").submit(function(evento){
    evento.preventDefault();
    const id = $("#id-paciente-atender").val();
    const formData = new FormData($("#formularioAtender")[0]);
    atenderPaciente(id, formData);
});