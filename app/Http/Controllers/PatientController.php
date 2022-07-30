<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUpdateRequest;
use Illuminate\Http\Request;
use App\Models\Paciente;
use Exception;
use Validator;

class PatientController extends Controller
{
    public function index(){      
        return view("welcome");
    }
    public function list(){
        $pacientes = Paciente::all();
        return response()->json([
            'pacientes'=>$pacientes
        ]);
    }
    public function store(Request $request){
        $paciente = new Paciente;
        $paciente->nome = $request->nome;
        $paciente->dataNascimento = $request->data;
        $paciente->cpf = $request->cpf;
        $paciente->whatsapp = $request->whatsapp;
        if($request->hasFile('foto') && $request->file('foto')->isValid()){
            $requestFoto = $request->foto;
            $extensao = $requestFoto->extension();
            $nomeFoto = md5($requestFoto->getClientOriginalName().strtotime("now")).".".$extensao;
            $requestFoto->move(public_path('img/pacientes'), $nomeFoto);
            $paciente->foto = $nomeFoto;
        }
        $paciente->save();
        return response()->json([
            'status'=>200,
            'mensagem'=>'Paciente cadastrado com sucesso!',
            'paciente'=>$paciente
        ]);
    }
    public function edit($id){
        $paciente = Paciente::find($id);
        if($paciente){
            return response()->json([
                'status'=>200,
                'paciente'=>$paciente
            ]);
        }
        else{
            return response()->json([
                'status'=>404,
                'mensagem'=>'Não encontrado'
            ]);
        }
    }
    public function destroy($id){
        $paciente = Paciente::find($id);
        Paciente::findOrFail($id)->delete();
        return response()->json([
            'status'=>200,
            'paciente'=>$paciente
        ]);
    }
    public function update(Request $request, $id){
        $paciente = Paciente::find($id);
        $paciente->nome = $request->nome;
        $paciente->dataNascimento = $request->data;
        $paciente->cpf = $request->cpf;
        $paciente->whatsapp = $request->whatsapp;
        if($request->hasFile('foto') && $request->file('foto')->isValid()){
            $requestFoto = $request->foto;
            $extensao = $requestFoto->extension();
            $nomeFoto = md5($requestFoto->getClientOriginalName().strtotime("now")).".".$extensao;
            $requestFoto->move(public_path('img/pacientes'), $nomeFoto);
            $paciente->foto = $nomeFoto;
        }
        $paciente -> save();
        return response()->json([
            'status'=>200,
            'mensagem'=>'Paciente editado com sucesso',
            'paciente'=>$paciente
        ]);
    }
    public function attendance($id){
        $paciente = Paciente::find($id);
        if($paciente){
            return response()->json([
                'status'=>200,
                'paciente'=>$paciente
            ]);
        }
        else{
            return response()->json([
                'status'=>404,
                'mensagem'=>'Não encontrado!'
            ]);
        }
    }
    public function diagnosis(Request $request, $id){
        $paciente = Paciente::find($id);
        $paciente->sintomas = $request->sintomas;
        $paciente->save();
        return response()->json([
            'paciente'=>$paciente
        ]);
    }
}