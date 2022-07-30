@extends("layouts.main")
@section("title","Clinica")
@section("content")
    <header>
        <nav class="navbar">
            <div class="container-fluid d-flex justify-content-center aling-items-center">
                <h1>Clinica</h1>
            </div>
        </nav>
    </header>
    <div class="container">
        <div class="row mb-4">
            <div class="d-flex justify-content-center aling-items-center">
                <button id="btn-cadastrar" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal">Novo Paciente</button>
            </div>
        </div>
        <div class="modal fade" id="modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Cadastro de Pacientes</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form id="formulario" enctype="multipart/form-data">
                    <div class="mb-1">
                        <label class="col-form-label">Nome:</label>
                        <input type="text" id="nome" name="nome" class="form-control text-center" placeholder="Nome completo...">
                    </div>
                    <div class="mb-1">
                        <label class="col-form-label">Data de Nascimento:</label>
                        <input type="date" id="data" name="data" class="form-control text-center">
                    </div>
                    <div class="mb-1">
                        <label class="col-form-label">CPF:</label>
                        <input type="text" id="cpf" name="cpf" class="form-control text-center" data-js="cpf" placeholder="000.000.000-00">
                    </div>
                    <div class="mb-3">
                        <label class="col-form-label">Whatsapp:</label>
                        <input type="text" id="whatsapp" name="whatsapp" class="form-control text-center" data-js="whatsapp" placeholder="(00) 0000-0000">
                    </div>
                    <div class="mb-1">
                        <label for="foto" class="form-control text-center">
                            <i class="bi bi-person-circle font-20"></i>
                            Foto do Paciente
                        </label>
                        <input type="file" id="foto" name="foto" class="d-none">
                    </div>
                    <div class="mt-3">
                        <button type="submit" id="botao" class="btn btn-primary">Cadastrar</button>
                    </div>
                  </form>
                  <div class="mt-3" id="msg-form">
            
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="modal fade" id="modalEditar" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Editar Paciente</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <input type="hidden" id="id-paciente-editar">
                  <form id="formularioEditar" enctype="multipart/form-data">
                    <div class="mb-1">
                        <label class="col-form-label">Nome:</label>
                        <input type="text" id="nome-editar" name="nome" class="form-control text-center" placeholder="Nome completo...">
                    </div>
                    <div class="mb-1">
                        <label class="col-form-label">Data de Nascimento:</label>
                        <input type="date" id="data-editar" name="data" class="form-control text-center">
                    </div>
                    <div class="mb-1">
                        <label class="col-form-label">CPF:</label>
                        <input type="text" id="cpf-editar" name="cpf" class="form-control text-center" data-js="cpf" placeholder="999.999.999-99">
                    </div>
                    <div class="mb-3">
                        <label class="col-form-label">Whatsapp:</label>
                        <input type="text" id="whatsapp-editar" name="whatsapp" class="form-control text-center" data-js="whatsapp" placeholder="(99) 99999-9999">
                    </div>
                    <div class="mb-1">
                        <label for="foto-editar" class="form-control text-center">
                            <i class="bi bi-person-circle font-20"></i>
                            Alterar foto do Paciente
                        </label>
                        <input type="file" id="foto-editar" name="foto" class="d-none">
                    </div>
                    <div class="mt-3">
                        <button type="submit" id="botao" class="btn btn-primary">Editar</button>
                    </div>
                  </form>
                  <div class="mt-3" id="msg-form-editar">
            
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="modal fade" id="modalDeletar" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Deletar Paciente</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <input type="hidden" id="id-deletar">
                  <p>Tem certeza de que deseja deletar este paciente?</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="button" id="confirm-deletar" class="btn btn-danger">Deletar</button>
                </div>
              </div>
            </div>
          </div>
        <div class="modal fade" id="modalAtender" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="atender-titulo">Paciente:</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form id="formularioAtender">
                    <div class="mb-1">
                        <input type="hidden" id="id-paciente-atender">
                        <label class="mb-1 font-18">Quais dos sintomas a seguir o paciente senti ou sentiu nos ultimos dias?</label>
                        <input type="checkbox" name="sintomas[]" value="Febre"> Febre
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Coriza"> Coriza
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Nariz Entupido"> Nariz Entupido
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Cansaço"> Cansaço
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Tosse"> Tosse
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Dor de cabeça"> Dor de cabeça
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Dores no corpo"> Dores no corpo
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Mal estar geral"> Mal estar geral
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Dor de garganta"> Dor de garganta
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Dificuldade de respirar"> Dificuldade de respirar
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Falta de paladar"> Falta de paladar
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Falta de olfato"> Falta de olfato
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Dificuldade de locomoção"> Dificuldade de locomoção
                        <br>
                        <input type="checkbox" name="sintomas[]" value="Diarréia"> Diarréia
                        <div class="mt-1">
                            <button type="submit" class="btn btn-primary">Finalizar</button>
                        </div>
                    </div>
                  </form>
                  <div class="mt-3" id="msg-form-atender">
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div class="row">
            <div id="msg-tabela"></div>
        </div>
        <div class="row mb-3" id="pesquisar">
            <div class="d-flex justify-content-center aling-items-center">
                <div class="col-md-4">
                    <input type="search" id="campo-pesquisar" class="form-control col-md-6" placeholder="Pesquise por um paciente...">
                </div>
            </div>
        </div>
        <div class="row">
            <table class="table table-bordered" id="tabela">
                <thead>
                    <tr class="text-center">
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>CPF</th>
                        <th>Whatsapp</th>
                        <th>Atendimento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="corpo-tabela">
                    
                </tbody>
            </table>
        </div>
    </div>
@endsection